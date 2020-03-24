export default class Table {
    columns: string[]
    rows: string[][]
    name: string
    columnSizes: number[] = []
    hiddenRows: string[] = []
    ignoredRows: string[] = []
    changed: boolean = false
    keyColumn: number
    
    constructor(name: string, columns: string[], rows: string[][], keyColumn?: string) {
        this.columns = columns
        this.rows = rows
        this.name = name
        this.keyColumn = keyColumn? columns.indexOf(keyColumn) : 0
    }

    updateColumn(column: string, values: string[] = []) {
        if(this.columns.includes(column)) {
            let index = this.columns.findIndex(title => title == column)

            values.forEach((value, i) => {
                if(i < this.rows.length && value != '') {
                    this.rows[i][index] = value
                    this.changed = true
                }
                    
            })
        } else {
            this.columns.push(column)
            this.rows.forEach((row, index) => {
                if(index < values.length)
                    row.push(values[index] || '')
                else
                    row.push('')
            })
            this.changed = true
        }
    }
    
    updateRowByObject(newRow: {[key: string]: string}) {
        let newRowKeyField = newRow[this.columns[this.keyColumn]]
        if(this.ignoredRows.includes(newRowKeyField))return

        let row = this.rows.findIndex(row => row[this.keyColumn] == newRowKeyField)
        if(row != -1) {
            Object.entries(newRow).forEach(entry => {
                const [key, value] = entry
                let i = this.columns.indexOf(key)
                if(i != -1 && value != '') {
                    this.rows[row][i] = value
                    this.changed = true
                }
            })
        } else {

            let newRowArray = []
            for (let i = 0; i < this.columns.length; i++) {
                newRowArray.push('')
            }
            row = this.rows.length
            this.rows.push(newRowArray)

            Object.entries(newRow).forEach(entry => {
                const [key, value] = entry
                let i = this.columns.indexOf(key)
                if(i != -1) {
                    this.rows[row][i] = value
                }
            })
            this.changed = true
        }
    }

    updateRowByArray(newRow: string[]) {
        if(this.ignoredRows.includes(newRow[this.keyColumn]))return

        if(newRow.length != this.columns.length) {
            console.log(`New row count doesn't match the size of the table. Expected ${this.columns.length}, got ${newRow.length}`);
            return
        }
            
        let index = this.rows.findIndex(row => row[0] == newRow[0])
        if( index != -1) {
            this.rows[index] = this.rows[index].map((field, i) => {
                if(newRow[i] == '') {
                    return field
                } else {
                    this.changed = true
                    return newRow[i]
                }
            })
        } else {
            this.rows.push(newRow)
            
        }
        this.changed = true
    }

    hideNoneExistingRows(existingRows: string[]) {
        this.hiddenRows = []
        this.rows.forEach((row, index) => {
            if(!this.ignoredRows.includes(row[this.keyColumn]) && !existingRows.includes(row[0])) {
                this.hiddenRows.push(row[this.keyColumn])
                this.changed = true
            }
                
        })
    }

    merge(table: Table) {
        table.columns.forEach(column => this.updateColumn(column))

        table.rows.forEach(row => {
            let rowObject: {[key: string]: string} = {}
            row.forEach((field, index) => rowObject[table.columns[index]] = field)
            this.updateRowByObject(rowObject)
        })

        this.hideNoneExistingRows(table.rows.map(row => row[this.keyColumn]))
    }

    isEmpty(): boolean {
        return this.rows.length == 0
    }
    
    generateTableString() {
        this.calcColumnSizes()

        let tableString = `## ${this.name}\n`

        let table = [this.columns, this.columnSizes.map(size => "-".repeat(size + 2)), ...this.rows]

        table.forEach((row, rowIndex) => {

            const hidden = this.hiddenRows.includes(row[this.keyColumn]) && rowIndex > 1

            if(hidden) tableString += "<!-- " // (rowIndex - 2) to accommodate for the header

            row.forEach((field, index) => {
                if(rowIndex == 1) {
                    tableString += "|" + field
                    tableString += " ".repeat(this.columnSizes[index] - field.length + 2)
                } else {
                    tableString += "| " + field
                    tableString += " ".repeat(this.columnSizes[index] - field.length + 1)
                }
            });
            tableString += "|"
            if(hidden) tableString += " -->"
            tableString += "\n"
        })
        
        return tableString
    }

    calcColumnSizes() {
        const tableTransposed = this.columns.map((col, i) => [this.columns, ...this.rows].map(row => row[i].length))
        this.columnSizes = tableTransposed.map(column => Math.max(...column))        
    }

    static getTable(text: string, name: string): Table | null {
    
        let tableMatch = text.match(new RegExp(`## ${name}\\s*?\\|(.*?\\|\\s\\|.*?){1,}\\|(\\n|$)(\\s*?<!-- readme-gen-igonre: .*? -->)?`,'m'))
        let tableString = ""
        let ignore: string[] = []
        
        if(!tableMatch) {
            console.log(`No Table with name ${name} detected`);
            return null
        } else {
            tableString = tableMatch[0].replace(/^\s*/gm, '')
        }
        let lines = tableString.replace(/\n$/g, '').split('\n') // remove last newline and split at each other newline
        
        if(lines[lines.length - 1].match(/\s*?<!-- readme-gen-igonre: .*? -->/)) {
            ignore = lines.pop()?.replace(/(\s*?<!-- readme-gen-igonre: | -->)/g, '').split(',').map(entry => '`'+entry.replace(/ /g, '')+'`') || []
        }

        let columns = lines[1].replace(/(^\||\|$)/g, '').split('|').map(column => column.replace(/\s+/g, ' ').replace(/(^ | $)/g, ''))
        let rows = []
        for (let i = 3; i < lines.length; i++){
            let fields = lines[i].replace(/(^\||\|$)/g, '').split('|').map(column => column.replace(/\s+/g, ' ').replace(/(^ | $)/g, ''))
            rows.push(fields)
        }

        let table = new Table(name, columns, rows)
        table.ignoredRows = ignore
        return table
    }

    replaceInReadme(readme: string): string {
        const regex = new RegExp(`## ${this.name}\\s*?\\|(.*?\\|\\s\\|.*?){1,}\\|(\\n|$)`,'m')
        let match = readme.match(regex)

        if(match) {
            readme = readme.replace(regex, this.generateTableString())
        } else {
            readme += "\n" + this.generateTableString()
        }
        
        return readme
    }
}
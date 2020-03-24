export default class Table {
    columns: string[]
    rows: string[][]
    name: string
    columnSizes: number[] = []
    hiddenRows: number[] = []
    changed: boolean = false
    
    constructor(name: string, columns: string[], rows: string[][]) {
        this.columns = columns
        this.rows = rows
        this.name = name
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
    
    updateRowByObject(newRow: {[key: string]: string}, keyColumn: string) {
        let column = this.columns.indexOf(keyColumn)
        if(column == -1) return
        let row = this.rows.findIndex(row => row[column] == newRow[keyColumn])
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
            if(!existingRows.includes(row[0])) {
                this.hiddenRows.push(index)
                this.changed = true
            }
                
        })
    }

    merge(table: Table, keyColumn: string) {
        table.columns.forEach(column => this.updateColumn(column))

        const columnIndex = this.columns.indexOf(keyColumn)

        table.rows.forEach(row => {
            let rowObject: {[key: string]: string} = {}
            row.forEach((field, index) => rowObject[table.columns[index]] = field)
            this.updateRowByObject(rowObject, keyColumn)
        })

        this.hideNoneExistingRows(table.rows.map(row => row[columnIndex]))
    }

    isEmpty(): boolean {
        return this.rows.length == 0
    }
    
    generateTableString() {
        this.calcColumnSizes()

        let tableString = `## ${this.name}\n`

        let table = [this.columns, this.columnSizes.map(size => "-".repeat(size + 2)), ...this.rows]

        table.forEach((row, rowIndex) => {

            const hidden = this.hiddenRows.includes(rowIndex - 2) && rowIndex > 1

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

    static getTable = function(text: string, name: string): Table | null {
    
        let table = text.match(new RegExp(`## ${name}\\s*?\\|(.*?\\|\\s\\|.*?){1,}\\|(\\n|$)`,'m'))
        let tableString = ""
        
        if(!table) {
            console.log(`No Table with name ${name} detected`);
            return null
        } else {
            tableString = table[0].replace(/^\s*/gm, '')
        }
    
        let lines = tableString.replace(/\n$/g, '').split('\n') // remove last newline and split at each other newline
    
        let columns = lines[1].replace(/(^\||\|$)/g, '').split('|').map(column => column.replace(/\s+/g, ' ').replace(/(^ | $)/g, ''))
        let rows = []
        for (let i = 3; i < lines.length; i++){
            let fields = lines[i].replace(/(^\||\|$)/g, '').split('|').map(column => column.replace(/\s+/g, ' ').replace(/(^ | $)/g, ''))
            rows.push(fields)
        }
        return new Table(name, columns, rows)
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
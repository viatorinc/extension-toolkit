class Table {
    
    constructor(name, columns, rows) {
        this.columns = columns
        this.rows = rows
        this.name = name
        
        this.calcColumnSizes()
        
    }

    updateColumn = function(column, values = []) {
        if(this.columns.includes(column)) {
            let index = this.columns.findIndex(title => title == column)

            values.forEach((value, i) => {
                if(i < this.rows.length && value != '')
                    this.rows[i][index] = value
            })
        } else {
            this.columns.push(column)
            this.rows.forEach((row, index) => {
                if(index < values.length)
                    row.push(values[index] || '')
                else
                    row.push('')
            })
        }
        this.calcColumnSizes()
    }
    
    updateRow = function(newRow) {
        let index = this.rows.findIndex(row => row[0] == newRow[0])
        if( index != -1) {
            this.rows[index] = this.rows[index].map((field, i) => newRow[i] == '' ? field : newRow[i])
        } else {
            this.rows.push(newRow)
        }

        this.calcColumnSizes()
    }
    
    generateTableString = function() {
        let tableString = `## ${this.name}\n`

        let table = [this.columns, this.columnSizes.map(size => "-".repeat(size + 2)), ...this.rows]

        table.forEach((row, rowIndex) => {
            row.forEach((field, index) => {
                if(rowIndex == 1) {
                    tableString += "|" + field
                    tableString += " ".repeat(this.columnSizes[index] - field.length + 2)
                } else {
                    tableString += "| " + field
                    tableString += " ".repeat(this.columnSizes[index] - field.length + 1)
                }
            });
            tableString += "|\n"
        })
        console.log(tableString);
        
        return tableString
    }

    calcColumnSizes = function() {
        const tableTransposed = this.columns.map((col, i) => [this.columns, ...this.rows].map(row => row[i].length))
        this.columnSizes = tableTransposed.map(column => Math.max(...column))        
    }

    static getTable = function(text, name) {
    
        let tableString = text.match(new RegExp(`## ${name}\\s\\|(.*?\\|\\s\\|.*?){1,}\\|\\n`,'m'))
        
        if(!tableString) {
            console.log("No Table detected");
            return null
        } else {
            tableString = tableString[0]
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
}
module.exports = Table
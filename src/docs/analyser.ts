import Table from './table'

export default class ModuleAnalyzer {

    file: string
    moduleName: string
    moduleTable: Table
    moduleKey: string = ""

    constructor(file: string, moduleName: string) {
        this.file = file
        this.moduleName = moduleName
        this.moduleTable = this.read()
    }

    read(): Table {
        return new Table('', [], [])
    }

    merge(readme: string): string {
        let readmeTable = Table.getTable(readme, this.moduleTable.name) || this.moduleTable

        if(readmeTable.isEmpty()) return readme

        if(readmeTable != this.moduleTable)
            readmeTable.merge(this.moduleTable, this.moduleKey)

        return readmeTable.replaceInReadme(readme)
    }

    getSection(section: string, ignore: RegExp): string | null {
        let formattedfile = this.file.replace(ignore, '')
        let match = formattedfile.match(new RegExp(`<${section}.*?>(.|\\s)*?</${section}.*?>`, 'gm'))
        if(match) return match[0]
        return null
    }
}
import Table from './table';
export default class ModuleAnalyzer {
    file: string;
    moduleName: string;
    moduleTable: Table;
    moduleKey: string;
    constructor(file: string, moduleName: string);
    read(): Table;
    merge(readme: string): string;
    getSection(section: string, ignore: RegExp): string | null;
}

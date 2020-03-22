export default class Table {
    columns: string[];
    rows: string[][];
    name: string;
    columnSizes: number[];
    constructor(name: string, columns: string[], rows: string[][]);
    updateColumn(column: string, values?: string[]): void;
    updateRow(newRow: string[]): void;
    generateTableString(): string;
    calcColumnSizes(): void;
    static getTable: (text: string, name: string) => Table | null;
}

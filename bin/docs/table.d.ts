export default class Table {
    columns: string[];
    rows: string[][];
    name: string;
    columnSizes: number[];
    hiddenRows: number[];
    changed: boolean;
    constructor(name: string, columns: string[], rows: string[][]);
    updateColumn(column: string, values?: string[]): void;
    updateRowByObject(newRow: {
        [key: string]: string;
    }, keyColumn: string): void;
    updateRowByArray(newRow: string[]): void;
    hideNoneExistingRows(existingRows: string[]): void;
    generateTableString(): string;
    calcColumnSizes(): void;
    static getTable: (text: string, name: string) => Table | null;
}

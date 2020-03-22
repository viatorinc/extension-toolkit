import Table from './table';
export declare function mergeCssVars(cssVarTable: Table, cssVars: object): Table;
export declare function mergeProps(propsTable: Table, props: {
    [key: string]: {
        [key: string]: string;
    };
}): Table;

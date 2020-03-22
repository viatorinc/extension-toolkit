export declare const command = "docs [folders]";
export declare const desc = "Create a readme for each component, interface";
export declare const builder: {
    folders: {
        default: string;
    };
};
export declare const handler: (argv: {
    folders: string;
}) => void;

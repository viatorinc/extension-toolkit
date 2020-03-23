import ModuleAnalyser from '../analyser';
import Table from '../table';
export default class PropsAnalyser extends ModuleAnalyser {
    read(): Table;
    propToOptions(prop: string, optionsString: string): {
        [key: string]: string;
    };
}

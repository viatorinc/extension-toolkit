import ModuleAnalyser from '../analyser'
import Table from '../table'
import { camelToSnake, wrapText } from '../../util/util'

export default class CssAnalyser extends ModuleAnalyser {

    read(): Table {
        this.moduleKey = 'Variable'

        const table = new Table('CSS Variables', ['Variable', 'Default'], [])
        const section = this.getSection('script', /a^/)
        if(!section) return table
        const cssVars = section.match(new RegExp(`^\t?(--${this.moduleName}.*?: .*?;)+?`, 'gm'))
        if( !cssVars) return table

        cssVars.forEach(variable => {
            const [name, value] = variable.replace(/(\t|;)/g, '').split(': ')
            table.updateRowByObject({
                Variable: name,
                Default: value
            }, 'Variable')
        });

        return table
    }
}
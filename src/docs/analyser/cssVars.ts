import ModuleAnalyser from '../analyser'
import Table from '../table'
import { wrapText } from '../../util/util'

export default class CssAnalyser extends ModuleAnalyser {

    read(): Table {
        const table = new Table('CSS Variables', ['Variable', 'Default'], [])
        const section = this.getSection('style', /a^/)
        if(!section) return table
        const cssVars = section.match(new RegExp(`^\t?(--${this.moduleName}.*?: .*?;)+?`, 'gm'))
        if( !cssVars) return table

        cssVars.forEach(variable => {
            const [name, value] = variable.replace(/(\t|;)/g, '').split(': ')
            table.updateRowByObject({
                Variable: wrapText(name, '`'),
                Default: wrapText(value, '`')
            })
        });

        return table
    }
}
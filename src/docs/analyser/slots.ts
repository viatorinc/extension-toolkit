import ModuleAnalyser from '../analyser'
import Table from '../table'
import { wrapText } from '../../util/util'

export default class SlotsAnalyser extends ModuleAnalyser {

    read(): Table {
        const table = new Table('Slots', ['Slot', 'Description', 'Data'], [])
        const section = this.getSection('template', /a^/)
        if(!section) return table
        const slots = section.match(/<slot(.|\s)*?>/g)
        if( !slots) return table

        slots.forEach(slot => {
            const nameMatch = slot.match(/name="(.*?)"/)         
            const name = nameMatch? wrapText(nameMatch[1], '`') : '_default_'
            const dataMatch = slot.match(/v-bind="(.*?)"/)
            const data = dataMatch? dataMatch[1] : ''

            table.updateRowByObject({
                Slot: name,
                Default: data
            })
        });

        return table
    }
}
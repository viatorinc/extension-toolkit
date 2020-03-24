import ModuleAnalyser from '../analyser'
import Table from '../table'

export default class EventAnalyser extends ModuleAnalyser {

    read(): Table {
        this.moduleKey = 'Event'

        const table = new Table('Events', ['Event', 'Description', 'Value'], [])
        const script = this.getSection('script', /(\r|\n|\t)/g) || ''
        const template = this.getSection('template', /(\r|\n|\t)/g) || ''
        if(script == '' && template == '') return table
        const section = template + script
        const emits = section.match(/emit\('.*?',.*?\)/g)
        if( !emits) return table

        emits.forEach(emit => {
            const match = emit.match(/'.*?'/)
            
            if(match) {
                table.updateRowByObject({
                    Event: match[0].replace(/'/g, '`'),
                }, 'Event')
            }
        });
        return table
    }
}
import ModuleAnalyser from '../analyser'
import Table from '../table'
import { camelToSnake, wrapText } from '../../util/util'

export default class PropsAnalyser extends ModuleAnalyser {

    read(): Table {
        const table = new Table('Props', ['Prop', 'Description', 'Default', 'Type'], [])
        const section = this.getSection('script', /(\r|\t)/g)

        if(!section) {
            return table
        }

        let prop= "",
            options = "",
            depth = 0

        let i = section.indexOf('props:') + 5
        while(section.charAt(i) != '{') { i++ }

        for (i; i < section.length; i++) {
            const c = section.charAt(i)

            if(depth == 1)
                prop += c
            if(depth > 1 && c != '}')
                options += c
            
            if(c == '{') depth++
            if(c == '}') {
                depth--

                if(depth == 1) {
                    table.updateRowByObject(this.propToOptions(prop, options))
                    prop = ""
                    options = ""
                }
            }
            if(depth == 0) break
        }
        return table
    }

    propToOptions(prop: string, optionsString: string): {[key: string]: string} {
        prop = prop.replace(/(\s|:|{|}|'|,)/gm, '')
        prop = wrapText(camelToSnake(prop), '`')

        let options: {[key: string]: string} = {Prop: prop}

        optionsString.split(/, *?\n/g).forEach(option => {
            let [name, value] = option.replace(/\n/g,'').split(': ')

            if(name == 'required' && value == 'true') {
                options.Prop += '*'
            } else {
                name = name.replace(/^./, g => g.toUpperCase())
                value = value.replace(/\|/g, 'or')
                options[name] = wrapText(value, '`')
            }
        })

        return options
    }
}
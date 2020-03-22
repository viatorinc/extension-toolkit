import fs from 'fs';
import path from 'path'
import { camelToSnake } from '../util/util'
import Table from '../util/table'

export const command = "docs [folders]";
export const desc = "Create a readme for each component, interface";

export const builder = {
    folders: {
        default: 'all'
    }
}
    

export const handler = function(argv: { folders: string }) {
    const { folders } = argv

    console.log("test");
    

    const allowedFolders = ['all', 'interfaces', 'components']

    if(allowedFolders.includes(folders) == false) {
        return console.log("Invalid folder!")
    }

    allowedFolders.shift()
    const folderList = folders == 'all' ? allowedFolders : [folders]

    folderList.forEach(folder => {
        let elements = fs.readdirSync('./src/'+ folder).filter(dir => !dir.match(/\..*?$/))
        
        elements.forEach(element => createDocs(folder, element))
        
    })
}

function createDocs(folder: string, element: string) {
    const folderLocation = path.join('src', folder, element)
    const vueFile = path.join(folderLocation, element + '.vue')
    const readmeFile = path.join(folderLocation, 'readme.md')

    if(!fs.existsSync(vueFile)) {
        return console.log("No Element detected: ", element);
    }

    let file = fs.readFileSync(vueFile).toString('utf8')
    file = file.replace(/(\r|\n|\t)/g, '') // remove any whitespace character exept space

    const section = getSection(file, 'script')
    if(!section) return
    const props = getProps(section)

    if(!fs.existsSync(readmeFile)) {
        fs.mkdirSync(readmeFile)
        console.log("Created Readme for: ", element, " at ", readmeFile);
    }
    
    let readme = fs.readFileSync(readmeFile).toString('utf8')
    readme = readme.replace(/(\r|\t)/g, '')

    const table = Table.getTable(readme, 'Props')
    if(table) {

        table.generateTableString()

        table.updateColumn('Type')
        
        Object.entries(props).forEach(entry => {
            let required = entry[1].required || 'false'
            let prop = '`'+camelToSnake(entry[0])+'`'
            if(required == 'true')prop += '*'
            let def = entry[1].default || ''
            def = '`' + def + '`'
            let type = entry[1].type || ''
            table.updateRow([prop, '', def, type])
        })

        table.generateTableString()
    }
        
}

function getProps(section: string): object {
    let props: {[key: string]: object} = {},
        key= "",
        prop = "",
        depth = 0

    let i = section.indexOf('props:') + 5
    while(section.charAt(i) != '{') { i++ }

    for (i; i < section.length; i++) {
        const c = section.charAt(i)

        if(depth == 1)
            key += c
        if(depth > 1 && c != '}')
            prop += c
        
        if(c == '{') depth++
        if(c == '}') {
            depth--

            if(depth == 1) {
                props[key.replace(/(\s|:|{|}|'|,)/gm, '')] = propOptionsToObject(prop)
                key = ""
                prop = ""
            }
        }

        if(depth == 0) break
    }
    return props
}

function propOptionsToObject(prop: string): object {
    let options: {[key: string]: string} = {}
    prop.split(',').forEach(option => {
        let o = option.split(':')
        options[o[0]] = o[1]
    })
    return options
}

function getSection(text: string, name: string): string | null {
    let match = text.match(new RegExp(`<${name}.*?>(.|\\s)*?</${name}.*?>`, 'gm'))
    if(match) return match[0]
    return null
}
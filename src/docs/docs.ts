import fs from 'fs';
import path from 'path'
import Table from './table'
import {mergeCssVars, mergeProps} from './merge'

export const docs = function(folders: string) {

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

function createDocs(folder: string, elementName: string) {
    const folderLocation = path.join('src', folder, elementName)
    const vueFile = path.join(folderLocation, elementName + '.vue')
    const readmeFile = path.join(folderLocation, 'readme.md')
    const newReadmeFile = path.join(folderLocation, 'new-readme.md')

    if(!fs.existsSync(vueFile)) {
        return console.log("No Element detected: ", elementName);
    }

    let file = fs.readFileSync(vueFile).toString('utf8')

    const script = getSection(file.replace(/(\r|\n|\t)/g, '') , 'script') // remove any whitespace character exept space
    if(!script) return
    const props = getProps(script)

    const css = getSection(file, 'style')
    if(!css) return
    const cssVars = getCssVars(css, elementName)

    if(!fs.existsSync(readmeFile)) {
        fs.mkdirSync(readmeFile)
        console.log("Created Readme for: ", elementName, " at ", readmeFile);
    }
    
    let readme = fs.readFileSync(readmeFile).toString('utf8')
    readme = readme.replace(/(\r)/g, '')

    const propsTable = Table.getTable(readme, 'Props') || new Table('Props', ['Prop', 'Description', 'Default', 'Type'], [])
    mergeProps(propsTable, props)
    readme = replaceTable(readme, 'Props', propsTable)

    let cssVarTable = Table.getTable(readme, 'CSS Variables') || new Table('CSS Variables', ['Variable', 'Default'], [])
    mergeCssVars(cssVarTable, cssVars)
    readme = replaceTable(readme, 'CSS Variables', cssVarTable)

    if(fs.existsSync(newReadmeFile)) {
        fs.unlinkSync(newReadmeFile)
    }

    let changes = []
    if(propsTable.changed) changes.push("Props")
    if(cssVarTable.changed) changes.push("CSS Variables")

    if(changes.length > 0)console.log(`${elementName}: Changes for ${changes.join(', ')}`);

    fs.writeFileSync(newReadmeFile, readme)
}

function replaceTable(readme: string, name: string, newTable: Table) {
    const regex = new RegExp(`## ${name}\\s\\|(.*?\\|\\s\\|.*?){1,}\\|(\\n|$)`,'m')
    let match = readme.match(regex)
    if(match) {
        readme = readme.replace(regex, newTable.generateTableString())
    } else {
        readme += "\n" + newTable.generateTableString()
    }
    return readme
}

function getCssVars(section: string, elementName: string): object {

    const cssVarsObject: {[key: string]: string} = {}

    const cssVars = section.match(new RegExp(`^\t?(--${elementName}.*?: .*?;)+?`, 'gm'))
    if( !cssVars) return cssVarsObject

    cssVars.forEach(variable => {
        const [key, value] = variable.replace(/(\t|;)/g, '').split(': ')
        cssVarsObject[key] = value
    });
    return cssVarsObject
}

function getProps(section: string): {[key: string]: {[key: string]: string}} {
    let props: {[key: string]: {[key: string]: string}} = {},
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

function propOptionsToObject(prop: string): {[key: string]: string} {
    let options: {[key: string]: string} = {}
    prop.split(',').forEach(option => {
        let o = option.split(': ')
        options[o[0]] = o[1]
    })
    return options
}

function getSection(text: string, name: string): string | null {
    let match = text.match(new RegExp(`<${name}.*?>(.|\\s)*?</${name}.*?>`, 'gm'))
    if(match) return match[0]
    return null
}
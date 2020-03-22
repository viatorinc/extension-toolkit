const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const ejs = require("ejs");
var Table = require("../table")

exports.command = "docs [folders]";
exports.desc = "Create a readme for each component, interface";
exports.handler = function(argv) {
    const { folders } = argv

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

function createDocs(folder, element) {
    const folderLocation = path.join('src', folder, element)
    const vueFile = path.join(folderLocation, element + '.vue')
    const readmeFile = path.join(folderLocation, 'readme.md')

    if(!fs.existsSync(vueFile)) {
        return console.log("No Element detected: ", element);
    }

    let file = fs.readFileSync(vueFile).toString('utf8')
    file = file.replace(/(\r|\n|\t)/g, '') // remove any whitespace character exept space

    const section = getSection(file, 'script')
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

function camelToSnake(name) {
    return name.replace(/([A-Z0-9])/g, (group) => "-"+group.toLowerCase())
}

function getProps(section) {
    let props = {},
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

function propOptionsToObject(prop) {
    let options = {}
    prop.split(',').forEach(option => {
        let o = option.split(':')
        options[o[0]] = o[1]
    })
    return options
}

function getSection(text, name) {
    return text.match(new RegExp(`<${name}.*?>(.|\\s)*?</${name}.*?>`, 'gm'))[0]
}
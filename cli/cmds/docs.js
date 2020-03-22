const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const ejs = require("ejs");

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

    getTable(readme, 'Props')
}

function getTable(text, name) {
    
    text = text.match(new RegExp(`## ${name}\\s\\|(.*?\\|\\s\\|.*?){1,}\\|\\n`,'m'))
    
    if(!text) {
        return console.log("No Table detected");
    } else {
        text = text[0]
    }

    let i = text.indexOf('## '+name)
    let start = i

    while(text.charAt(i) != '|'){i++}
    categories = []
    categorie = ""

    while(text.charAt(i) != '\n') {
        let c = text.charAt(i)

        if(c == '|') {
            categories.push(categorie)
            categorie = ""
        } else {
            categorie += c
        }
        i++
    }
    console.log(categories);
    
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
    return text.match(new RegExp(`<${name}.*?>(.|\\s)*?</${name}.*?>`, 'gm')).toString()
}
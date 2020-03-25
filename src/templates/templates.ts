import fs from 'fs';
import path from 'path'
import ejs from 'ejs'
import * as util from '../util/util'

export default function(type: string, name: string) {
    
    const templateFolders = fs.readdirSync(__dirname).filter(dir => !dir.match(/\./g))
    if(!templateFolders.includes(type)) {
        return console.log(`The given type does not exist. Possible types: ${templateFolders.join(', ')}`);
    }

    if(fs.existsSync(path.join('src', type, name))) return console.log("The name already exists, please choose another name.");

    const files = fs.readdirSync(path.join(__dirname, type)).filter(dir => dir.match(/.txt$/gm))
    fs.mkdirSync(path.join('src', type, name))

    console.log("Docs have been generated");
    

    files.forEach( async file => {
        const fileContent = fs.readFileSync(path.join(__dirname, type, file)).toString('utf8').split('\n')
        const parserPath = path.join(__dirname, type, file.replace('.txt', '.js'))
        let data: {[key: string]: string} = {}
        if(fs.existsSync(parserPath)) {
            const parser = <Function> (await import(parserPath)).default
            
            if(parser instanceof Function && parser.name == 'parser') {
                data = parser(name) || {}
            }
        }

        let fileName = fileContent.shift() || ''
        fileName = ejs.render(fileName, {name}).replace(/\s/g, '')
        const content = fileContent.join('\n')

        data.name = util.snakeToTitle(name)
        data.type = type
        data.nameSnake = name
        data.nameCamel = util.snakeToCamel(name)
        data.nameCamelFull = util.snakeToCamel('-'+name)
        
        fs.writeFile(path.join('src', type, name, fileName), ejs.render(content, data), (err) =>{
            if(err) console.error(err);
        })
    })
    
}
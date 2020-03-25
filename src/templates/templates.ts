import fs from 'fs';
import path from 'path'
import ejs from 'ejs'

export default async function(type: string, name: string) {
    
    const templateFolders = fs.readdirSync(__dirname).filter(dir => !dir.match(/\./g))
    if(!templateFolders.includes(type)) {
        return console.log(`The given type does not exist. Possible types: ${templateFolders.join(', ')}`);
    }

    if(fs.existsSync(path.join('./src', type, name))) return console.log("The name already exists, please choose another name.");

    const files = fs.readdirSync(path.join(__dirname, type)).filter(dir => dir.match(/.txt$/gm))
    fs.mkdirSync(path.join('src', type, name))

    await delay(1000)

    files.forEach( file => {
        const fileContent = fs.readFileSync(path.join(__dirname, type, file)).toString('utf8').split('\n')
        const fileName = fileContent.shift() || ''
        const content = fileContent.join('\n')
        console.log("Path: ", path.join('src', type, name, ejs.render(fileName, {name})));
        
        console.log("Exists: ", fs.existsSync(path.join('src', type, name)));
        
        fs.writeFile(path.join('src', type, name, ejs.render(fileName, {name}))+".txt", ejs.render(content) + "A", (err) =>{
            if(err) console.error(err);
        })
    })
    
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
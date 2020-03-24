import fs from 'fs';
import path from 'path'
import Table from './table'
import ModuleAnalyser from './analyser'
import { createHeader } from '../util/util'

export const docs = async function(folders: string) {

    const allowedFolders = ['all', 'interfaces', 'components']
    const analysers: typeof ModuleAnalyser[] = []

    if(allowedFolders.includes(folders) == false) {
        return console.log("Invalid folder!")
    }

    allowedFolders.shift()
    const folderList = folders == 'all' ? allowedFolders : [folders]

    const analyserFiles = fs.readdirSync(path.join(__dirname, 'analyser')).filter(dir => dir.match(/.*?\.js$/))

    for (let i = 0; i < analyserFiles.length; i++) {
        const analyser = analyserFiles[i];
        
        module = await import(path.join(__dirname, 'analyser', analyser))
        Object.values(module).forEach(value => {   
            
            if(value instanceof Function && value.__proto__ == ModuleAnalyser) {
                
                let analyser = <typeof ModuleAnalyser> value
                analysers.push(analyser);
            }
        })
    }

    folderList.forEach(folder => {
        let modules = fs.readdirSync('./src/'+ folder).filter(dir => !dir.match(/\..*?$/))
        modules.forEach(module => {
            console.log(createHeader(module, 36));
            createDocs(folder, module, analysers)
        })
        
    })
}

function createDocs(folder: string, moduleName: string, analysers: typeof ModuleAnalyser[]) {
    const folderLocation = path.join('src', folder, moduleName)
    const vueFile = path.join(folderLocation, moduleName + '.vue')
    const readmeFile = path.join(folderLocation, 'readme.md')
    const newReadmeFile = path.join(folderLocation, 'new-readme.md')

    if(!fs.existsSync(vueFile)) {
        return console.log("No Module detected!");
    }

    let file = fs.readFileSync(vueFile).toString('utf8')

    if(!fs.existsSync(readmeFile)) {
        fs.mkdirSync(readmeFile)
        console.log("Created Readme for: ", moduleName, " at ", readmeFile);
    }
    
    let readme = fs.readFileSync(readmeFile).toString('utf8')
    readme = readme.replace(/(\r)/g, '')

    let changes: string[] = []

    analysers.forEach(analyserClass => {
        const analyser = new analyserClass(file, moduleName)
        readme = analyser.merge(readme)
        if(analyser.moduleTable.changed)
            changes.push(analyser.moduleTable.name)
    })

    if(fs.existsSync(newReadmeFile)) {
        fs.unlinkSync(newReadmeFile)
    }

    if(changes.length > 0)console.log(`${moduleName}: Changes for ${changes.join(', ')}`);

    fs.writeFileSync(newReadmeFile, readme)
}
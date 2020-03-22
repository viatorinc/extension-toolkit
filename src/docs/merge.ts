import Table from './table'
import { camelToSnake, wrapText } from '../util/util'

export function mergeCssVars(cssVarTable: Table, cssVars: object): Table {
    cssVarTable.updateColumn('Variable')
    cssVarTable.updateColumn('Default')
    
    Object.entries(cssVars).forEach(entry => {
        const [variable, def] = entry
        cssVarTable.updateRowByObject({
            Variable: wrapText(variable, '`'),
            Default: wrapText(def, '`')
        }, 'Variable')
    })

    cssVarTable.hideNoneExistingRows(Object.keys(cssVars).map(cssVar => wrapText(cssVar, '`')))
    return cssVarTable
}
export function mergeProps(propsTable: Table, props: {[key: string]: {[key: string]: string}}): Table {
    propsTable.updateColumn('Prop')
    propsTable.updateColumn('Description')
    propsTable.updateColumn('Default')
    propsTable.updateColumn('Type')
    
    Object.entries(props).forEach(entry => {
        let required = entry[1].required || 'false'
        let prop = wrapText(camelToSnake(entry[0]), '`')
        if(required == 'true')prop += '*'
        let def = entry[1].default || ''
        let type = entry[1].type || ''

        propsTable.updateRowByObject({
            Prop: prop,
            Default: wrapText(def, '`'),
            Type: wrapText(type, '`')
        }, 'Prop')
    })

    propsTable.hideNoneExistingRows(Object.keys(props).map(prop => {
        let propFormattet = wrapText(camelToSnake(prop), '`')
        if(props[prop].required) propFormattet += '*'
        return propFormattet
    }))
    return propsTable
}
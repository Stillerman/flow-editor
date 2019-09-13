import { map } from 'ramda';
import { DOTFILE } from './Constants';

const fs = require('fs')
const Path = require('path')
const { all, prop } = require('ramda')

export function getDotFile (path) {
    return new Promise((acc, rej) => {
        fs.readFile(dfPath(path), (err, data) => {
            if (err) rej(err)
            acc((data || '').toString())
        })
    }).then(parseContent).catch(err => {
        console.log('.flow file invalid, creating new one.', err)
        
        return createDotFile(path).then(() => {
            return getDotFile(path) // try again
        })
    })
}

export function createDotFile (path) {
    return new Promise((acc, rej) => {
        fs.writeFile(dfPath(path), JSON.stringify(DOTFILE), (err) => {
            if (err) rej(err)
            acc()
        })
    })
}

function parseContent (content) {
    return new Promise((acc, rej) => {
        try {
            let parsed = JSON.parse(content)
            if (!isValidConfig(parsed)) rej('.flow file not vaild')
            else acc(parsed)
        } catch (err) {
            rej(err)
        }
    })
}

function isValidConfig (config) {
    return all(
        true
    )
}

function dfPath(path) {
    return Path.join(path, '.flow')
}
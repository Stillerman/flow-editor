const fs = require('fs')
const Path = require('path')

export function createSkeleton (path) {
    return ls(path).then(files => {
        return Promise.all(
            files.map(file => {
                return new Promise((acc, rej) => {
                    fs.readFile(Path.join(path, file), (err, data) => {
                        if (err) rej(err)
                        else acc([file, data.toString()]) 
                    })
                })
            })
        )
    })
    // .then(fileContents => {
    //     return fileContents.reduce((prev, curr, index, array) => {
    //         prev[curr[0]] = curr[1]
    //         return prev
    //     }, {})
    // })
} 



function ls (path) {
    return new Promise((acc, rej) => {
        fs.readdir(path, (err, items) => {
            if (err) rej(err)
            else acc(items)
        })
    })
}
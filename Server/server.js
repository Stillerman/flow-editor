import { createSkeleton } from './skeleton'

const express = require('express')
let cors = require('cors')

var bodyParser = require('body-parser')
const fs = require('fs')
const Bundler = require('parcel-bundler')
const Path = require('path')
const port = 3000

const util = require('util');
const exec = util.promisify(require('child_process').exec);

export const createServer = (config) => new Promise((acc, rej) => {
    const app = express()
    app.use(cors())
    app.use(bodyParser.json())

    
    // app.get('/', (req, res) => res.sendFile(Path.join(__dirname, '../Clien')))
    app.use('/', express.static(Path.join(__dirname, '../Client/dist')))

    app.get('/skelly', (req, res) => {
        createSkeleton(Path.join(config.cwd, config.blocks)).then(skelly => {
            res.json(skelly)
        })
    })

    app.post('/changes', (req, res) => {
        console.log("LOOOOOK", req.body)

        let writeOps = req.body.map(asset => {
            return new Promise((acc, rej) => {
                fs.writeFile('./.work/' + asset.title, asset.code, (err) => {
                    if (err) rej(err)
                    acc()
                })
            })
        })

        Promise.all(writeOps).then(() => {
            const entryFiles = Path.join(config.cwd, config.blocks, '/index.js')
            console.log(entryFiles)
            const bundler = new Bundler(entryFiles, {
                outDir: Path.join(config.cwd, './dist'),
                watch: false,
                detailedReport: true
            })
        
            bundler.bundle()
        
            bundler.on('bundled', _ => {
                console.log('bundle made!')
                res.send(fs.readFileSync(Path.join(config.cwd, './dist/index.js')))
            })
        
            bundler.on('buildError', error => {
                res.status(500).send(error)
            })
        })
    })

    app.listen(port, () => {
        console.log(`Local Flow server listening on port ${port}!`)

        let osxExecPath = Path.join(__dirname, '../Flow\\ Editor.app')

        exec('open ' + osxExecPath.toString()).then(() => {
            acc(app)
        })

    })


})
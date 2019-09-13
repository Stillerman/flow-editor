const program = require('commander')
const Path = require('path')
import { getDotFile, createDotFile } from './dotty'
import { createServer } from './server'

export function cli(args) {
  program.option('-d, --debug', 'output extra debugging')
  program.parse(args)

  let nonFlags = args.slice(2).filter(arg => !arg.startsWith('-'))

  let [morePath, ...otherArgs] = nonFlags 
  let cwd = Path.join(process.cwd(), morePath)

  readOrCreateDotFile(cwd).then(info => {
    info.cwd = cwd
    console.log('DOTFILE:', info)
    return createServer(info)
  })

  if (program.debug) console.log(program.opts());
}


function readOrCreateDotFile (cwd) {
  return getDotFile(cwd).catch(err => {
    if (err.errno === -2) { // file doesnt exist
      return createDotFile(cwd).then(() => {
        return readOrCreateDotFile(cwd)
      })
    } else {
      console.log('There was an error with the dotfile:', err)
    }
  })
}

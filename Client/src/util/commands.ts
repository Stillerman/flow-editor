import api from './api'
import Vue from 'vue'
const uuid = require('uuid/v1')


export default function parse(cmd : string, vm: Vue) : Promise<any> {
    cmd = cmd.toLowerCase().replace(' ', '')

    return new Promise ((acc, rej) => {
        if (commands[cmd]) {
            acc(commands[cmd](vm))
        } else {
            rej('No matching commands')
        }
    })
}



const commands = {
    build (vm) {
        console.log('BUILDING')

        vm.building = true
        api.post('/changes', vm.blocks.map(block => block.asset)).then(resp => {
          console.log('resp.data', resp.data)
          eval(resp.data)
          vm.building = false
        }).catch(err => {
          console.log('failure', err)
          vm.building = false
        })
    },
    new (vm) {
        vm.blocks.push({
            asset: {
                title: 'sup',
                code: 'none'
            },
            coords: {
                x: 0,
                y:0 
            },
            uid: uuid()
        })
    }
}
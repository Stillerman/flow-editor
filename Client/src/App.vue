<template>
  <div id="app" class="bg-gray-500">
    <nav class="flex item-center p6 bg-gray-900 p-6 w-full justify between">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <svg class="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/></svg>
        <span class="font-semibold text-xl tracking-tight">Flow Editor</span>
      </div>        
      <div class="w-full lg:px-6 xl:w-3/4 xl:px-12">
        <div class="relative">
          <input id="cmd-palette" @keydown.enter="executeCmd" v-model="cmd" class="transition outline-none border border-transparent placeholder-red-900 text-white rounded-lg bg-gray-800 focus:bg-gray-700 py-2 pr-4 pl-10 block w-full appearance-none leading-normal" type="text" placeholder="Command Palette (Press CMD + &quot;/&quot; to focus)">
          <div class="pointer-events-none text-white absolute inset-y-0 left-0 pl-4 flex items-center">
            <!-- <svg class="fill-current pointer-events-none text-gray-600 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/></svg> -->
          </div>
        </div>
      </div>
      <div>
        <grid-loader v-if="building" :size="10" :color="'#2D3748'"/>
      </div>
    </nav>
    <div v-if="loaded" class="p-1 h-full"  id="board">
      <svg class="h-full w-full fixed">
        <g fill="white" stroke="green" stroke-width="5" v-for="(tree, index) in importTrees" :key="index">
          <!-- blocks[index] is the block1 in question and tree[] contains all block 2s -->
          <!-- <path v-for="(imp, i) in tree" :key="i" :d="`M${x1},${y1} C${x1 + 100},${y1 - 100}  ${x2 - 100},${y2 + 100}  ${x2},${y2}`" fill="none" stroke="#000" stroke-width="2px" /> -->
          <line v-for="(imp, i) in tree" :key="i" v-if="defined(imp)" :x1="blCoords(index).x" :y1="blCoords(index).y" :x2="blCoords(imp).x" :y2="blCoords(imp).y" style="stroke:rgb(255,0,0);stroke-width:2" />

        </g>
      </svg>
      <CodeBlock v-for="(block, index) in blocks"
        :key="index"
        :incomingAsset="block.asset"
        class="fixed"
        :class="{ focused: block.uid === focusedBlock}"
        @click="focusedBlock = block.uid"
        @moved="newCoords => blocks[index].coords = newCoords"
        @assetUpdate="asset => blocks[index].asset = asset"
        @updatedImports="imports => reAsignImports(index, imports)"
        :sources="sourceList"
      />
    </div>
    <div v-else>
      <grid-loader :size="10" :color="'#2D3748'"/>
    </div>
    <!-- <button class="absolute rounded">Hi</button> -->
    <!-- <three-canvas> </three-canvas> -->
  </div>
</template>

<script>
import "prismjs"
import "./prism-style.css"
import "vue-prism-editor/dist/VuePrismEditor.css"
import CodeBlock from './components/CodeBlock.vue'
import ThreeCanvas from './components/ThreeCanvas.vue'
import Windows from './components/Windows.vue'
import { GridLoader } from '@saeris/vue-spinners'
import api from './util/api'
import { log } from 'util'
import parseCommand from './util/commands.ts'

// const panzoom = require('panzoom')


const R = require('ramda')
const uuid = require('uuid/v1')

export default {
  name: 'app',
  components: {
    CodeBlock,
    GridLoader,
    ThreeCanvas,
    Windows
  },
  computed: {
    sourceList () {
      return this.blocks.map(b => b.asset.title)
    }
  },
  mounted () {
    this.fetchSkeleton()

    // soom(this.$el.querySelector('#board'))

    window.addEventListener('keydown', evt => {
      this.handleKeyCommand(evt)
    })
  },
  data () {
    return {
      code: '',
      cmd: '',
      building: false,
      loaded: false,
      focusedBlock: '',
      importTrees: {},
      blocks: [
        {
          asset :{
            title: 'double.js',
            code: 'export default function double (n) {\n  return n * 2;\n}'
          },
          uid: uuid(),
          coords: {
            x: 0,
            y: 0
          }
        }
      ]
    }
  },
  methods: {
    blCoords (index) {
      return this.blocks[index] ? this.blocks[index].coords : undefined
    },
    moved (newCoords) {
      console.log(newCoords)
    },
    strip (lst) {
      return R.pick(['code', 'title', 'uid'], lst)
    },
    handleKeyCommand (evt) {
      console.log('owww' + Math.random())

      if (evt.metaKey && evt.code === 'KeyO') {
        evt.preventDefault()
        this.blocks.push({
          asset: {
            title: 'hello.js',
            code: 'export default function hello (name) {\n  console.log("hello, " + name)\n}'
          },
          uid: uuid(),
          coords: {
            x: Math.random() * 100,
            y: Math.random() * 100
          }
        })
      }

      if (evt.metaKey && evt.code === 'Slash') {
        let cmdp = this.$el.querySelector('#cmd-palette')
        let focused = document.activeElement === cmdp
        
        if (focused) cmdp.blur()
        else cmdp.focus()
      }
    },
    reAsignImports (index, imports) {
      console.log('called reAsignImports()', index, imports)

      let indexesOfImports = imports.map(imp => {
        let matching = this.blocks.indexOf(this.blocks.find(block => imp.source.includes(block.asset.title)))
        return matching
      })


      console.log('before', index, this.importTrees[index])
      this.importTrees[index] = indexesOfImports.map(idx => idx >= 0 ? idx : undefined)
      console.log('after', index, this.importTrees[index])
    },
    defined (thingy) {
      return typeof thingy !== 'undefined'
    },
    executeCmd () {
      parseCommand(this.cmd, this)
      .then(() => this.code = '')
      .catch(problem => {
        console.warn(problem)
      })
    },
    fetchSkeleton () {
      api.get('/skelly').then(resp => {
        let fileContentPairs = resp.data
        this.$set(this, 'blocks', fileContentPairs.map(pair => {
          return {
            asset: {
              title: pair[0],
              code: pair[1],
            },
            uid: uuid(),
            coords: {
              x: Math.random() * 500,
              y: Math.random() * 500
            }
          }
        }))
        console.log(this.blocks)
      }).then(() => {
        console.log(this.blocks)
        this.loaded = true
      })
    }
  }
}
</script>

<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;


#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: fixed;
  /* height: 100%; */
  width: 100%;
  top:0;
  bottom: 0;
}
</style>

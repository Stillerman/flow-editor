<template>
    <div class="codeblock overlay bg-gray-900 p-2 text-white rounded-lg" @keydown="saveIfAskedTo">
      <div class="mb-1 text-left bg-gray-800 rounded p-2 handle">
        <span class="text-left bg-teal-700 px-2 rounded text-gray-400 flex-none">{{extension}}</span>
        <span class="text-left bg-indigo-700 px-2 rounded text-white text-gray-400 flex-none">Function</span>
        <span class="cursor-default flex-1 outline-none bg-gray-700 text-gray-400 px-2 rounded"  spellcheck="false" @keydown="handleEnter" :class="{'italic': dirty, 'font-extrabold': dirty}" contenteditable @blur="editTitle" v-html="title"></span>
      </div>
      <!-- <prism-editor class="rounded" :code="content"></prism-editor> -->
      <div class="text-left">
        <span class="flex py-1 ml-1">
          <p class="pr-1">Code</p>
          <svg @click="showImporter = !showImporter" class="icon" height="10" width="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.719 14.75a.997.997 0 0 1-.664-.252L-.005 10l5.341-4.748a1 1 0 0 1 1.328 1.495L3.005 10l3.378 3.002a1 1 0 0 1-.664 1.748zm8.945-.002L20.005 10l-5.06-4.498a.999.999 0 1 0-1.328 1.495L16.995 10l-3.659 3.252a1 1 0 0 0 1.328 1.496zm-4.678 1.417l2-12a1 1 0 1 0-1.972-.329l-2 12a1 1 0 1 0 1.972.329z" fill="white" /></svg>
        </span>
        <importer v-if="showImporter" @import="handleNewImport" :sources="sources"></importer>
        <prism-editor class="editor rounded" v-model="code" :language="extension" @click="hault" @keydown="handleKeyDown" :emitEvents="true" />
      </div>
      <div v-if="extension === 'js' && parsedCode" class="text-left">
        <p class="py-1 ml-1">Parsed</p>
        <div class="bg-gray-800 rounded-sm pl-1">
          <p class="text-xs">Imports</p>
          <ul>
            <li v-for="imprt in parsedCode.imports" :key="JSON.stringify(imprt)">
              <p class="text-xs ml-3">{{imprt.spec.join(', ')}} - {{imprt.source}}</p>
            </li>
          </ul>
          <p class="text-xs">Exports</p>
          <p class="text-xs ml-3"><b>Default</b> {{parsedCode.export}}</p>
        </div>
      </div>
      <div v-if="parsingErr">
        Parsing Error
        <div>
          <p>{{parsingErr}}</p>
        </div>
      </div>
    </div>
</template>

<script>
import Ace from 'vue2-ace-editor'
import PrismEditor from 'vue-prism-editor'
import dragElement from '../drag'
import Importer from './Importer.vue'

const babelParser = require('@babel/parser')

const prune = require('json-prune')
const R = require('ramda')

const is = R.propEq

const getExtension = (fileName) => R.last(fileName.split('.'))

export default {
  components: { PrismEditor, Importer },
  props: ['incomingAsset', 'sources'],
  data () {
    return {
      code: 'var a = 0;',
      title: 'NewBlock.js',
      showImporter: false,
      parsedCode: undefined,
      parsingErr: '',
      dirty: false,
      x: Math.random() * 1000,
      y: Math.random() * 1000,
    }
  },
  computed: {
    extension () {
      return getExtension(this.title)
    },
    asset () {
      return {
        code: this.code,
        title: this.title,
        extension: this.extension
      }
    },
    babel () {
      return new Promise((res, rej) => {
        try {
          res(babelParser.parse(this.code, {
            sourceType: 'unambiguous'
          }))
        } catch (error) {
          rej(err)
        }
      })
    }
  },
  mounted () {
    if (this.incomingAsset) {
      Object.keys(this.incomingAsset).forEach(key => {
        this[key] = this.incomingAsset[key]
      })
    }

    this.save()

    dragElement(this.$el, newCoords => {
      this.x = newCoords.x
      this.y = newCoords.y
    })

    this.$el.addEventListener('mousedown', (evt) => {
      this.$emit('click', evt)
    })
  },
  watch: {
    babel: {
      immediate: true,
      deep: true,
      handler (b) {
        b.then((babel) => {
          let declarations = babel.program.body
          let defaultExport = declarations.find(is('type', 'ExportDefaultDeclaration'))
          let imports = declarations.filter(is('type', 'ImportDeclaration')).map(imp => {
            return {
              source: imp.source.value,
              spec: imp.specifiers.map(s => s.local.name)
            }
          })


          // if (!defaultExport) return { err: 'no export' }

          const toExport = defaultExport ? 
                          (defaultExport.declaration.name || defaultExport.declaration.id.name)
                          : undefined 

          console.log({ title: this.title, defaultExport, toExport, imports })

          this.parsedCode = {
            export: toExport,
            imports: imports
          }
          this.parsingErr = ''
        }).catch(err => {
          this.parsingErr = err
          this.parsedCode = undefined
        })
      }
    },
    code () {
      this.dirty = true
    },
    x: {
      immediate: true,
      handler() {
        this.emitCoords()
      }
    },
    y: {
      immediate: true,
      handler() {
        this.emitCoords()
      }
    },
    parsedCode (npc) {
      this.$emit('updatedImports', npc.imports)
    }
  },
  methods: {
    type (decl) {
      return decl['type'] || 'Any'
    },
    prune,
    handleKeyDown ({code}) {
      if (code === "AltLeft") {
        this.save()
      }
    },
    handleNewImport (imp) {
      let name = imp.split('.')[0]

      this.code = `import ${name} from './${imp}'\n` + this.code
    },
    saveIfAskedTo (evt) {
      if (evt.metaKey && evt.code === 'KeyS') {
        evt.preventDefault()
        this.save()
      }
    },
    emitCoords () {
      this.$emit('moved', R.pick(['x', 'y'], this))
    },
    handleEnter (event) {
      if (event.code === "Enter"){
        event.target.blur()
        this.save()
        event.preventDefault()
      }
    },
    editTitle ({target}) {
      this.title = target.innerHTML
    },
    save () {
      this.dirty = false
      this.$emit('assetUpdate', this.asset)
    },
    hault () {
      alert()
    }
  }
}
</script>

<style lang="postcss">
.codeblock {
  color: #303025;
}

.codeblock.focused {
  @apply border border-gray-600;
  z-index: 999;
}

.editor {
  height: 100%;
}

svg.icon {
  height: 0.8em;
  width: 0.8em;
  transition: all 0.1s ease;
  margin-top: 0.3em;
}

.overlay:after {
  position: absolute;
  content: '';
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 1);
  opacity: 0.3;
  pointer-events: none;
  @apply rounded-lg
}
.overlay.focused:after {
  opacity: 0;
}

svg.icon:hover {
  height: 1em;
  width: 1em;
  margin-top: 0.28em
}
</style>

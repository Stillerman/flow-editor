<template>
  <div>
    <hsc-menu-style-metal style="position: fixed; z-index: 2;">
      <hsc-menu-bar style="border-radius: 0 0 4pt 0">
        <hsc-menu-bar-item label="Number">
          <hsc-menu-item label="New Code Block" keybind="alt+n" @click="newCodeBlock" />
          <hsc-menu-item label="Clear" keybind="alt+k" />
        </hsc-menu-bar-item>
        <hsc-menu-bar-item label="Windows">
          <hsc-menu-item v-for="block in blocks" :key="block.uid" :label="block.title" @click="block.isOpen = !block.isOpen" :checked="block.isOpen" />
        </hsc-menu-bar-item>
      </hsc-menu-bar>
    </hsc-menu-style-metal>
  </div>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import api from '../util/api'
import uuid from 'uuid/v1'
import CodeBlock from './CodeBlock.vue'


type Block = {
    code: string
    title: string
    coordinates: Coords
    uid: string
    isOpen: boolean
}

type Coords = {
  x: number,
  y: number
}

@Component({
  name: 'Windows',
  components: { CodeBlock }
})
export default class Sample6 extends Vue {
  loaded: boolean = false
  blocks: Block[] = []
  focusedBlock: string = ''

  mounted () {
      this.fetchSkeleton()
  }

  sourceList () {
      return this.blocks.map(b => b.title)
  }

  newCodeBlock () {
    this.blocks.push({
      code: 'export default foo () {\n  \n}',
      title: 'foo.js',
      coordinates: {
        x: Math.floor(Math.random() * 300),
        y: Math.floor(Math.random() * 300)
      },
      uid: uuid(),
      isOpen: true
    })
  }

  fetchSkeleton () {
      api.get('/skelly').then(resp => {
        let fileContentPairs = resp.data
        this.blocks = fileContentPairs.map(pair => {
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
        })
      }).then(() => {
        this.loaded = true
      })
    }
  }
}
</script>


<style lang="scss" scoped>
table {
  white-space: nowrap;
  border-spacing: 0.5em;
}
td,
th {
  text-align: center;
  padding: 1em;
  box-shadow: 0 0 4pt rgba(0, 0, 0, 0.25);
  background-color: #eee;
  border-radius: 4pt;
}
</style>
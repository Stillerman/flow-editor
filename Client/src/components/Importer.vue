<template lang="pug">
.importer.flex
  button.bg-gray-700.rounded.text-gray-400.font-bold.py-2.px-4.mr-2(class="hover:bg-gray-600 focus:outline-none active:bg-blue-500", @click="$emit('import', choice)")
    | Import
  .w-full
    label.block.uppercase.tracking-wide.text-gray-600.text-xs.font-bold.mb-2(for='grid-state')
      | Modules
    .relative.w-full
      select#grid-state.block.appearance-none.w-full.bg-gray-900.text-gray-600.py-3.rounded(class='focus:outline-none focus:bg-grey-700')
        option(v-for="source in sources", v-model="choice") {{source}}
      //- .pointer-events-none.absolute.inset-y-0.right-0.flex.items-center.px-2.text-gray-400
      //-   svg.fill-current.h-4.w-4(xmlns='http://www.w3.org/2000/svg' viewbox='0 0 20 20')
      //-     path(d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z')
</template>

<script>
export default {
  props: ['sources'],
  name: 'Importer',
  data () {
    return {
      choice: this.sources[0] || ''
    }
  }
}
</script>



<style lang="postcss" scoped>
.importer {
  @apply mb-2 rounded p-2 bg-gray-800
}
</style>

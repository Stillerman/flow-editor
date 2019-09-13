<template lang="pug">
.canvas
    p ello
</template>


<script>
import ThreeCanvas from '../three.js'

export default {

    mounted () {
        let tc = new ThreeCanvas(this.$el)
        tc.animate()
    }
    
}
</script>

<style lang="postcss">
.sexy {
    @apply fixed bg-blue-500;
    width: 100px;
    height: 116px;
}
</style>


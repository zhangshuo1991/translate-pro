<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
import Translate from './components/Translate.vue'
import TranslateMT from './components/TranslateMT.vue'
import db_dexie from './utils/db_dexie'
import {defineComponent, onMounted, ref} from "vue";
export default defineComponent({
  components: {TranslateMT, Translate},
  setup() {

    let config = ref('oneToMore')
    onMounted( () => {
      //这里是主进程传过来的消息
      db_dexie.layout_config.reverse().toArray().then(function(result: any) {
        config.value=result[0].config
        console.log(config)
      })
    })
    return {
      config
    }
  }
})
</script>

<template>
  <translate-m-t v-if="config === 'moreToMore'"></translate-m-t>
  <translate v-if="config === 'oneToMore'"></translate>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>

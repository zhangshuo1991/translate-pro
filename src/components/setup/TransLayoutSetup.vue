<template>
  <div style="text-align: left;padding-left: 30px">
    <el-radio-group v-model="layout_radio">
      <el-radio label="oneToMore">一个输入框多个结果框</el-radio>
      <el-radio label="moreToMore">多个输入框与翻译框</el-radio>
    </el-radio-group>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from 'vue'

export default defineComponent({
  setup (props, { emit }) {

    let layout_radio = ref('oneToMore')

    watch(layout_radio, (newValue, oldValue) => {
      emit('layout', layout_radio)
    })
    return {
      layout_radio
    }
  }
})
</script>

<style scoped>

</style>
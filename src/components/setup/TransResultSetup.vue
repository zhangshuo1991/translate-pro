<template>
  <div style="text-align: left;">
    <el-form
        ref="ruleForm"
        :inline="true"
        label-width="60px"
        class="demo-ruleForm"
    >
      <el-form-item label="字体">
        <el-select style="width:300px;" v-model="fontFamily" clearable placeholder="选择字体">
          <el-option
              v-for="item in fontFamily_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字号">
        <el-input-number
            v-model="fontSize"
            type="number"
            style="width:300px;font-family: 'Arial Hebrew'"
            autocomplete="off"
        ></el-input-number>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: "TranslateResult",
  setup(props, { emit }) {
    let fontFamily = ref("fontFamily")
    let fontSize = ref(12)

    const fontFamily_options = [
      {
        value: 'Microsoft YaHei',label: 'Microsoft YaHei'
      },
      {
        value: 'Arial Hebrew',label: 'Arial Hebrew'
      }
    ]
    function resetForm() {

    }
    return {
      resetForm,
      fontSize,
      fontFamily_options,
      fontFamily
    }
  }
})
</script>

<style scoped>
</style>
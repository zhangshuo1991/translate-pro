<template>
  <div id="app" style="overflow: hidden">
    <el-row>
      <el-col :span="2"></el-col>
      <el-col :span="20">
        <div style="width: 100px;height: 30px;line-height: 30px;border-bottom: 1px solid #339D9D;margin-bottom: 20px">
          <span style="font-size: 15px;font-weight: bolder">翻译内容：</span>
        </div>
        <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="translateText"
            :input-style="{fontSize: '16px',fontWeight:'bolder'}"
            :autosize="{ minRows: 4, maxRows: 7}"
        >
        </el-input>
        <div style="text-align: right;margin-top: 15px">
          <el-button size="mini" type="primary" @click="exportResult">导出</el-button>
          <el-button size="mini" type="info" @click="translateText = ''">清空</el-button>
        </div>

      </el-col>
      <el-col :span="2"></el-col>
    </el-row>
    <el-divider content-position="center">翻译结果展示</el-divider>
    <el-row>
      <el-col :span="2"></el-col>
      <el-col :span="20">
        <translate-result v-for="(item,index) in translateResultList" :key="item.id" :keyId="item.id" @removeTran = "removeTran"></translate-result>
      </el-col>
      <el-col :span="2">
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div style="text-align: center;margin-top: 15px">
          <circle-plus style="width: 2em; height:2em;color: dodgerblue;cursor: pointer;" @click="addTranslateResult"></circle-plus>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { CirclePlus,CircleClose } from '@element-plus/icons'
import TranslateResult from './TranslateResult.vue'
import {defineComponent,reactive,ref,provide} from 'vue'
export default defineComponent({
  name: 'Translate',
  components: {
    TranslateResult,
    CirclePlus,CircleClose
  },
  setup() {
    let translateText = ref('')
    let translateResult = ref('')
    let select_translate_engine = ref('')
    let translateResultList = ref([{
      id: new Date().getTime().toString(),
      text: '翻译框'
    }])

    function exportResult() {

    }
    function addTranslateResult() {
      translateResultList.value.push(
          {
            id: new Date().getTime().toString(),
            text: '翻译框'
          }
      )
    }
    function removeTran(e) {

      let tempArray = []
      translateResultList.value.forEach(thisItem => {
        if(thisItem.id !== e){
          tempArray.push(thisItem)
        }
      })
      console.log(tempArray)
      translateResultList.value = tempArray
    }
    provide('translate_text',translateText)
    return {
      // 这里的属性 和 方法 会合并到 data 函数 和 methods 对象里
      translateText,
      translateResult,
      select_translate_engine,
      translateResultList,
      exportResult,
      removeTran,
      addTranslateResult
    }
  },
})
</script>

<style scoped>

</style>
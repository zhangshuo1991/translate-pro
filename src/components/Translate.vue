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
            @focus="testCopy"
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
    <el-drawer
        v-model="drawer"
        :direction="direction"
        size="50%"
        :show-close="false"
        :with-header="false"
    >
      <el-table :data="tableData" style="width: 100%" height="100%"
        :row-style="{fontSize: '12px'}"
        :header-row-style="{fontSize: '12px'}"
      >
        <el-table-column prop="date" label="翻译时间">
          <template #default="scope">
            {{dateFtt('yyyy-MM-dd hh:mm:ss',scope.row.date) }}
          </template>
        </el-table-column>
        <el-table-column prop="tranlate_text" label="翻译文本"/>
        <el-table-column prop="translate_result" label="翻译结果" />
        <el-table-column prop="translate_target" label="翻译语言" />
      </el-table>
    </el-drawer>
    <el-dialog v-model="dialogTableVisible" :fullscreen="true">
      <template #title>
        <div style="height:30px;line-height: 30px;border-bottom: 1px solid #91949A;width:100%;text-align: left;">字体设置</div>
      </template>
      <div>
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="输入设置" name="1">
            <trans-text-setup></trans-text-setup>
          </el-collapse-item>
          <el-collapse-item title="输出设置" name="2">
            <trans-result-setup></trans-result-setup>
          </el-collapse-item>
          <el-collapse-item title="布局设置" name="3">
            <trans-layout-setup @layout="setLayout"></trans-layout-setup>
          </el-collapse-item>
        </el-collapse>
      </div>
      <template #footer>
        <el-button type="primary" @click="saveConfig">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { CirclePlus,CircleClose } from '@element-plus/icons'
import TranslateResult from './TranslateResult.vue'
import TransResultSetup from './setup/TransResultSetup.vue'
import TransTextSetup from './setup/TransTextSetup.vue'
import TransLayoutSetup from './setup/TransLayoutSetup.vue'

import {defineComponent, reactive, ref, provide, onMounted,nextTick} from 'vue'
const { ipcRenderer } = require( 'electron')
import db_dexie from '../utils/db_dexie'
import {ElMessage} from "element-plus";
import clipboardy from 'clipboardy';

export default defineComponent({
  name: 'Translate',
  components: {
    TranslateResult,
    TransResultSetup,
    TransTextSetup,
    TransLayoutSetup,
    CirclePlus,CircleClose
  },
  setup() {
    let translateText = ref('')
    let translateResult = ref('')
    let select_translate_engine = ref('')
    let layout_setup = ref('oneToMore')
    const tableData = ref([])
    const drawer = ref(false)
    const dialogTableVisible = ref(false)
    const direction = ref('rtl')
    const activeNames = ref(['1','2'])
    let translateResultList = ref([{
      id: new Date().getTime().toString(),
      text: '翻译框'
    }])
    onMounted( () => {

      ipcRenderer.on('send-message-to-render-test',(event: any, arg: any)=>{
        //这里是主进程传过来的消息
        db_dexie.tranlate_log.reverse().toArray().then(function(result: any) {
          tableData.value = result
          drawer.value = true
        })
      })

      ipcRenderer.on('send-message-font',(event: any, arg: any)=>{
        //这里是主进程传过来的消息
        dialogTableVisible.value = true
      })
    })
    function dateFtt(fmt,date) { //author: meizz
      var o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
      };
      if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
      for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      return fmt;
    }
    function exportResult() {
      ipcRenderer.send("compress-image", 'hello');
    }
    function addTranslateResult() {
      translateResultList.value.push(
          {
            id: new Date().getTime().toString(),
            text: '翻译框'
          }
      )
    }
    function removeTran(e: string) {

      let tempArray: { id: string; text: string; }[] = []
      translateResultList.value.forEach(thisItem => {
        if(thisItem.id !== e){
          tempArray.push(thisItem)
        }
      })
      translateResultList.value = tempArray
    }
    const handleChange = (val: any) => {
      console.log(val)
    }
    const setLayout = (e: { value: any }) => {
      layout_setup.value = e.value
    }
    function saveConfig() {
      db_dexie.layout_config.add({
        date: new Date(),config:layout_setup.value
      })
      ElMessage({
        message: '保存成功',
        type: 'success',
      })
      dialogTableVisible.value = false
    }

    async function testCopy() {
      if(translateText.value === '' || translateText.value === null) {
        translateText.value=await clipboardy.read()
      }
    }
    provide('translate_text',translateText)
    return {
      // 这里的属性 和 方法 会合并到 data 函数 和 methods 对象里
      drawer,
      direction,
      translateText,
      translateResult,
      select_translate_engine,
      translateResultList,
      tableData,
      dialogTableVisible,
      activeNames,
      testCopy,
      handleChange,
      dateFtt,
      saveConfig,
      setLayout,
      exportResult,
      removeTran,
      addTranslateResult
    }
  },
})
</script>

<style scoped>

</style>
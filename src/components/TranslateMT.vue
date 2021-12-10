<template>
  <el-row>
    <el-col :span="24">
      <trans-result-mto-m v-for="(item,index) in translateResultList" :key="item.id" :key-id="item.id" @removeTran = "removeTran"></trans-result-mto-m>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="11">
    </el-col>
    <el-col :span="1">
      <div style="text-align: center;">
        <circle-plus style="width: 2em; height:2em;color: dodgerblue;cursor: pointer;" @click="addTranslateResult"></circle-plus>
      </div>
    </el-col>
    <el-col :span="12">
    </el-col>
  </el-row>
  <el-dialog v-model="dialogTableVisible" :fullscreen="true">
    <template #title>
      <div style="height:30px;line-height: 30px;border-bottom: 1px solid #91949A;width:100%;text-align: left;">字体设置</div>
    </template>
    <div>
      <el-collapse v-model="activeNames">
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
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import TransResultMtoM from './layoutMtoM/TransResultMtoM.vue'
import { CirclePlus,CircleClose } from '@element-plus/icons'
import {ipcRenderer} from "electron";
import db_dexie from "../utils/db_dexie";
import TransResultSetup from './setup/TransResultSetup.vue'
import TransTextSetup from './setup/TransTextSetup.vue'
import TransLayoutSetup from './setup/TransLayoutSetup.vue'
import {ElMessage} from "element-plus";
const { ipcRenderer } = require( 'electron')

export default defineComponent({
  name: "TranslateMT",
  components: {TransResultMtoM,CirclePlus,TransResultSetup,TransTextSetup,TransLayoutSetup},
  setup(props, { emit }) {
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
    function addTranslateResult() {
      translateResultList.value.push(
          {
            id: new Date().getTime().toString(),
            text: '翻译框'
          }
      )
    }
    function removeTran(e: string) {
      console.log(e)
      let tempArray: { id: string; text: string; }[] = []
      translateResultList.value.forEach(thisItem => {
        if(thisItem.id !== e){
          tempArray.push(thisItem)
        }
      })
      translateResultList.value = tempArray
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
    const dialogTableVisible = ref(false)
    const direction = ref('rtl')
    const activeNames = ref(['1','2','3'])
    let layout_setup = ref('oneToMore')

    return{
      dialogTableVisible,
      direction,
      activeNames,
      layout_setup,
      setLayout,
      saveConfig,
      removeTran,
      addTranslateResult,
      translateResultList
    }
  }
})
</script>

<style scoped>

</style>
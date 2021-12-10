<template>
  <el-row>
    <el-col :span="4">

    </el-col>
    <el-col :span="20" style="padding-bottom: 10px">
      <el-select size="medium" @change="changeEngine" v-model="tranlateTegine" placeholder="选择翻译引擎" clearable filterable>
        <el-option
            v-for="item in select_translate_engine_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select style="margin-left: 10px"  size="medium" v-model="tranlateLang" placeholder="选择翻译引擎" clearable filterable>
        <el-option
            size="mini"
            v-for="item in select_translate_lng_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        >
        </el-option>
      </el-select>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="11">
      <el-input
          v-model="leftTextValue"
          type="textarea"
          maxlength="5000"
          :autosize="{ minRows: 10, maxRows: 20 }"
          show-word-limit
          placeholder="请输入要翻译"
          @focus="testCopy"
      />
    </el-col>
    <el-col :span="1">
      <div style="height:200px;line-height:200px">
        <Switch style="width: 1.5em; height:1.5em;color: dodgerblue;cursor: pointer;" @click="switchText"></Switch>
      </div>
    </el-col>
    <el-col :span="12">
      <el-input
          v-model="rightTextValue"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 20 }"
          readonly
      />
    </el-col>
  </el-row>
  <div style="text-align: right;height:30px">
    <el-button type="text" size="medium" @click="onCopy" icon="el-icon-document-copy" style="font-size: 20px"></el-button>
    <el-button type="text" size="medium" @click="removeThis" icon="el-icon-document-remove" style="font-size: 20px;color: red"></el-button>
    <el-button type="text" size="medium" @click="collect" icon="el-icon-star-off" style="font-size: 20px;color: #E6A23C"></el-button>
  </div>
  <el-divider></el-divider>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, watch} from "vue";
import { Switch,CircleClose } from '@element-plus/icons'
import axios from "axios";
import {ElMessage} from "element-plus";
import db_dexie from "../../utils/db_dexie";
import useClipboard from 'vue-clipboard3'
import clipboardy from "clipboardy";
export default defineComponent( {
  name: "TransResultMtoM",
  components: {
    Switch,
    CircleClose,
    ElMessage
  },
  props: ['keyId'],
  setup(props, { emit }) {
    const { toClipboard } = useClipboard()

    let leftTextValue = ref('')
    let rightTextValue = ref('')
    const tranlateTegine = ref('baidu')
    const tranlateLang = ref('en')


    watch(leftTextValue, (newValue, oldValue) => {
      if(tranlateTegine.value === 'baidu') {
        translateTextBaidu()
      }
      if(tranlateTegine.value === 'google') {
        translateTextGoogle()
      }
    })
    function switchText() {
      const tempValueRight = rightTextValue.value
      leftTextValue.value = rightTextValue.value
      rightTextValue.value = tempValueRight
    }
    function changeEngine(val: string){
      if(val === 'baidu'){
        select_translate_lng_options.value = select_translate_language_baidu
        translateTextBaidu()
      }else if(val === 'google') {
        select_translate_lng_options.value = select_translate_language_google
        translateTextGoogle()
      }
    }
    async function translateTextBaidu() {
      if(tranlateLang.value !== '' && leftTextValue.value !== '') {
        const res = await axios.get('https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=FWcAAATAaTmxDIAMZuIr3Zqk&client_secret=7yK4xnGwEkfmG2VGQUGng8DH1Q9CB6Qq')
        const access_token = res.data.access_token
        axios.post('https://aip.baidubce.com/rpc/2.0/mt/texttrans/v1?access_token='+access_token+'',{from: 'auto',to:tranlateLang.value,q:leftTextValue.value}).then(res => {
          rightTextValue.value = res.data.result.trans_result[0].dst
        })
      }
    }

    function translateTextGoogle() {

      if(tranlateLang.value !== '' && leftTextValue.value !== ''){
        axios.get('https://translation.googleapis.com/language/translate/v2?key=AIzaSyA6jJ6imuvgpjNS3EaUoRxqePUAUeldopI&q='+leftTextValue.value+'&target='+tranlateLang.value+'',{timeout: 50000,timeoutErrorMessage: '连接超时'}).then(res => {
          if(res.data.data.translations.length>0){
            rightTextValue.value = res.data.data.translations[0].translatedText
          }
        }).catch(err =>{
          console.error(err)
        })
      }
    }

    async function onCopy() {
      await toClipboard(rightTextValue.value)
      ElMessage({
        message: '复制成功',
        type: 'success',
      })
    }

    function collect(){
      db_dexie.tranlate_log.add({
        date: new Date(),tranlate_text: leftTextValue.value,translate_target: tranlateLang.value,translate_result: rightTextValue.value
      })
      ElMessage({
        message: '收藏成功',
        type: 'success',
      })
    }

    function removeThis(){
      emit('removeTran', props.keyId);
    }
    async function testCopy() {
      if(leftTextValue.value === '' || leftTextValue.value === null) {
        leftTextValue.value=await clipboardy.read()
      }
    }
    const select_translate_engine_options= [
      {
        value:'baidu',label: '百度翻译'
      },
      {
        value:'google',label: '谷歌翻译'
      },
    ]
    const select_translate_language_google = [
      {label: '白俄罗斯语',	value: 'be'},
      {label: '孟加拉语',	value: 'bn'},
      {label: '波斯尼亚语',	value: 'bs'},
      {label: '保加利亚语',	value: 'bg'},
      {label: '中文', value: 'zh-CN'},
      {label: '克罗地亚语',	value: 'hr'},
      {label: '捷克语',	value: 'cs'},
      {label: '丹麦语',	value: 'da'},
      {label: '荷兰语',	value: 'nl'},
      {label: '英语',	value: 'en'},
      {label: '芬兰语',	value: 'fi'},
      {label: '法语',	value: 'fr'},
      {label: '格鲁吉亚语',	value: 'ka'},
      {label: '德语',	value: 'de'},
      {label: '意大利语',	value: 'it'},
      {label: '日语',	value: 'ja'},
      {label: '韩语',	value: 'ko'},
      {label: '蒙古文',	value: 'mn'},
      {label: '葡萄牙语',	value: 'pt'},
      {label: '塞尔维亚语',	value: 'sr'},
      {label: '西班牙语',	value: 'es'},
      {label: '泰语',	value: 'th'},
      {label: '土耳其语',	value: 'tr'},
      {label: '乌克兰语',	value: 'uk'},
      {label: '越南语',	value: 'vi'},
    ]
    const select_translate_language_baidu = [
      {label: '白俄罗斯语',	value: 'bel'},
      {label: '孟加拉语',	value: 'ben'},
      {label: '波斯尼亚语',	value: 'bos'},
      {label: '保加利亚语',	value: 'bul'},
      {label: '中文', value: 'zh'},
      {label: '中文(文言文)', value: 'wyw'},
      {label: '中文(粤语)', value: 'yue'},
      {label: '克罗地亚语',	value: 'hrv'},
      {label: '捷克语',	value: 'cs'},
      {label: '丹麦语',	value: 'dan'},
      {label: '荷兰语',	value: 'nl'},
      {label: '英语',	value: 'en'},
      {label: '芬兰语',	value: 'fin'},
      {label: '法语',	value: 'fra'},
      {label: '格鲁吉亚语',	value: 'geo'},
      {label: '德语',	value: 'de'},
      {label: '意大利语',	value: 'it'},
      {label: '日语',	value: 'jp'},
      {label: '韩语',	value: 'kor'},
      {label: '葡萄牙语',	value: 'pt'},
      {label: '塞尔维亚语',	value: 'srp'},
      {label: '西班牙语',	value: 'spa'},
      {label: '泰语',	value: 'th'},
      {label: '土耳其语',	value: 'tr'},
      {label: '乌克兰语',	value: 'ukr'},
      {label: '越南语',	value: 'vie'},
    ]
    let select_translate_lng_options = ref(select_translate_language_baidu)
    return {
      switchText,
      changeEngine,
      onCopy,
      removeThis,
      collect,
      testCopy,
      select_translate_lng_options,
      tranlateLang,
      select_translate_language_google,
      select_translate_language_baidu,
      select_translate_engine_options,
      tranlateTegine,
      leftTextValue,
      rightTextValue
    }
  }
})
</script>

<style scoped>

</style>
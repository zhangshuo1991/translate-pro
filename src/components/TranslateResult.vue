<template>
  <div style="width: 100px;height: 30px;line-height: 30px;border-bottom: 1px solid #339D9D;margin-top: 15px">
    <span style="font-size: 15px;font-weight: bolder">翻译结果：</span>
  </div>
  <div style="float: left;height: 50px;line-height: 50px">
    <span style="font-family: PingFang SC;font-size: 14px">翻译引擎：</span>
    <el-select size="mini" @change="changeEngine" v-model="select_translate_engine" placeholder="请选择翻译引擎">
      <el-option
          v-for="item in select_translate_engine_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
  <div style="float: left;padding-left: 15px;height: 50px;line-height: 50px">
    <span style="font-family: PingFang SC;font-size: 14px">翻译目标语言：</span>
    <el-select size="mini" filterable clearable @change="changeTargetLng" v-model="targetSourceLng" placeholder="请选择翻译的目标语言">
      <el-option
          v-for="item in select_translate_lng_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
  <div>
    <div shadow="hover">
      <el-input
          type="textarea"
          placeholder="翻译结果展示"
          v-model="translate_result"
          readonly
          :input-style="{fontSize: '20px',fontWeight:'bolder',textAlign: 'center'}"
          :autosize="{ minRows: 4, maxRows: 7}"
      >
      </el-input>
    </div>
    <div style="text-align: right;">
      <el-button type="text" size="medium" @click="onCopy" icon="el-icon-document-copy" style="font-size: 20px"></el-button>
      <el-button type="text" size="medium" @click="removeThis" icon="el-icon-document-remove" style="font-size: 20px;color: red"></el-button>
      <el-button type="text" size="medium" @click="collect" icon="el-icon-star-off" style="font-size: 20px;color: #E6A23C"></el-button>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import useClipboard from 'vue-clipboard3'
import {defineComponent, reactive, ref, inject, watch, onMounted} from 'vue'
import { ElMessage } from 'element-plus'
import db_dexie from '../utils/db_dexie'

export default defineComponent({
  name: 'TranslateResult',
  props: ['keyId'],
  setup(props, { emit }) {
    const translate_text = inject('translate_text')
    const { toClipboard } = useClipboard()
    const select_translate_engine_options= [
      {
        value:'baidu',label: '百度翻译'
      },
      {
        value:'google',label: '谷歌翻译'
      },
    ]
    const copy_message = ref('复制翻译结果')

    watch(translate_text, (newValue, oldValue) => {
      if(select_translate_engine.value === 'baidu') {
        translateTextBaidu()
      }
      if(select_translate_engine.value === 'google') {
        translateTextGoogle()
      }
    })

    onMounted(() => {
      if(select_translate_engine.value === 'baidu') {
        translateTextBaidu()
      }else if(select_translate_engine.value === 'google') {
        translateTextGoogle()
      }
    })

    let translate_result = ref('')

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
    let targetSourceLng = ref('en')
    let select_translate_engine = ref('google')
    let select_translate_lng_options = ref(select_translate_language_google)
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
      if(targetSourceLng.value !== '' && translate_text.value !== '') {
        const res = await axios.get('https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=FWcAAATAaTmxDIAMZuIr3Zqk&client_secret=7yK4xnGwEkfmG2VGQUGng8DH1Q9CB6Qq')
        const access_token = res.data.access_token
        axios.post('https://aip.baidubce.com/rpc/2.0/mt/texttrans/v1?access_token='+access_token+'',{from: 'auto',to:targetSourceLng.value,q:translate_text.value}).then(res => {
          translate_result.value = res.data.result.trans_result[0].dst
        })
      }
    }

    function translateTextGoogle() {

      if(targetSourceLng.value !== '' && translate_text.value !== ''){
        axios.get('https://translation.googleapis.com/language/translate/v2?key=AIzaSyA6jJ6imuvgpjNS3EaUoRxqePUAUeldopI&q='+translate_text.value+'&target='+targetSourceLng.value+'',{timeout: 50000,timeoutErrorMessage: '连接超时'}).then(res => {
          if(res.data.data.translations.length>0){
            translate_result.value = res.data.data.translations[0].translatedText
          }
        }).catch(err =>{
          console.error(err)
        })
      }
    }

    function changeTargetLng() {
      if(select_translate_engine.value === 'baidu') {
        translateTextBaidu()
      }else if(select_translate_engine.value === 'google') {
        translateTextGoogle()
      }
    }

    async function onCopy() {
      await toClipboard(translate_result.value)
      ElMessage({
        message: '复制成功',
        type: 'success',
      })
    }

    function onResize({ width, height }) {
    }

    function collect(){
      db_dexie.tranlate_log.add({
        date: new Date(),tranlate_text: translate_text.value,translate_target: targetSourceLng.value,translate_result: translate_result.value
      })
      ElMessage({
        message: '收藏成功',
        type: 'success',
      })
    }

    function removeThis(){
      emit('removeTran', props.keyId);
    }

    return {
      translate_text,
      select_translate_engine_options,
      select_translate_lng_options,
      select_translate_engine,
      changeEngine,
      changeTargetLng,
      onCopy,
      removeThis,
      collect,
      translate_result,
      copy_message,
      targetSourceLng
    }
  }
})
</script>

<style scoped>

</style>
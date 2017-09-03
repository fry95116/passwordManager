<template lang="pug">
  .p-4
    h4 应用设置
    hr
    .form-group
      label 锁定时间
      input.form-control(
        v-model="duration"
        type="number"
        min="0"
        pattern="\\d*"
        placeholder="单位：秒"
        @blur="$forceUpdate()"
      )
      small.form-text.text-muted 私钥在内存中驻留的最长时间（单位：秒）
    .form-group
      label 数据导入/导出
      .form-row
        .col
          label.custom-file
            input.custom-file-input.w-100(type="file")
            span.custom-file-control
    br
    h4 秘钥管理
    hr
    .form-group
      label 秘钥
      .input-group
        input.form-control.currentKeygen(
          v-bind:value="keygen"
          type="text"
          placeholder="无"
          readonly
        )
        span.input-group-btn
          button.btn.btn-primary(@click="generateKeygen") 生成/更换
      small.form-text.text-muted 存储用于加密的公钥与算法
    br
    h4 随机密码生成器配置
    hr
    .form-group
      label 长度
      input.form-control(
        v-model="passwordLength"
        type="number"
        min="1"
        pattern="\\d*"
        placeholder="length"
        @blur="$forceUpdate()"
      )
    .form-group
      label 所用字符集
      .custom-controls-stacked.ml-3.mb-3
        -
          var CHARSETS = {
            upperCase: '大写字母[A-Z]',
            lowerCase: '小写字母[a-z]',
            number: '数字[0-9]',
            specialSymbol: '特殊符号[!@#$%^&*]'
          }
        each value, key in CHARSETS 
          label.custom-control.custom-checkbox.my-2
            input.custom-control-input(
              v-model="charsetNames"
              value=key
              type="checkbox"
            )
            span.custom-control-indicator
            span.custom-control-description.ml-2 #{value}
    .form-group
      label 生成测试
      .input-group
        span.input-group-btn
            button.btn.btn-light(
              v-clipboard:copy="randomPassword",
              v-clipboard:success="onCopySucceed"
              v-clipboard:error="onCopyError"
            )
              span.oi.oi-clipboard
        input.form-control(
          v-model="randomPassword"
          type="text"
          placeholder="生成结果"
        )
        span.input-group-btn
          button.btn.btn-primary(@click="generatePassword") 生成
    </label>
</template>
<script>

import _ from 'lodash'
import {generatePassword} from '../RPGA'
import RSAKey from '../encrypt/rsa'

export default {

  data(){
    return {
      randomPassword: ''
    }
  },

  computed: {
    /* 系统设置 */
    duration: {
      get(){return this.$store.state.configs.duration},
      set(newValue){
        this.$store.commit('configs/update', {
          attr: 'duration',
          newValue: parseInt(newValue)
        })
      }
    },
    
    /* 秘钥管理 */
    keygen(){
      return this.$store.getters['keygen/formatted']
    },
    
    /* 随机密码生成器 */
    passwordLength: {
      get(){return this.$store.state.randomPasswordGenerator.length},
      set(length){this.$store.commit('randomPasswordGenerator/setLength',{length})}
    },

    charsetNames: {
      get(){return this.$store.state.randomPasswordGenerator.charsets},
      set(charsets){this.$store.commit('randomPasswordGenerator/setCharsets',{charsets})}
    },

    charset:{
      get(){return this.$store.getters['randomPasswordGenerator/charset']}
    }
  },

  methods: {
    /** 生成新密钥 */
    generateKeygen(){
      this.$store.commit('keygen/generate')
    },

    /** 生成新密码 */
    generatePassword(){
      this.randomPassword = generatePassword(this.charset, this.passwordLength)
    },
    /** 剪切板操作 */
    onCopySucceed(){this.$toast('复制到剪贴板')},
    onCopyError(){this.$toast('复制失败')}
  }
}
</script>
<style lang="scss">

.currentKeygen{
  text-overflow: ellipsis;
}
.custom-file-control::before {
  content: "导入" !important;
}
.custom-file-control::after {
  content: "选择文件" !important;
}
</style>

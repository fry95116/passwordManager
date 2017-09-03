<template lang="pug">
#newAccount
  form
    .form-group
      label 账户信息名称
      input.form-control(
        name="name"
        :class="{'is-invalid': errors.name}"
        type="text"
        placeholder="account info name"
        v-model="name"
      )
      .invalid-feedback {{errors.name}}
      small.form-text.text-muted
        | Tips: 不建议使用账号作为账户信息名称

    .form-group
      label 标签
      .input-group
        .form-control
          span.tag.mr-1(
            v-for="tag in tags"
            v-bind:key="tag"
            v-bind:style="{ 'background-color': enum_tags[tag].bgColor}"
          ) &nbsp;
        tag-picker.input-group-btn(
          btnStyle="btn btn-primary dropdown-toggle"
          v-model="tags"
        )
    .form-group
      .form-row
        .col
          label 账户信息
      .form-row.tr
        .col-1.th
        .col-3.th 名称
        .col-5.th 值
        .col-3.th 关注
      .form-row.tr(
        v-for="(info, index) in informations"
        v-bind:key="index"
      )
        .col-1.td
          button.btn-badge.btn-danger(
            type="button"
            @click="removeInfo(index)"
          )
            span.oi.oi-minus
        .col-3.td {{info.title}}
        .col-7.td {{info.value}}
        .col-1.td
          label.custom-control.custom-radio.mb-0.mr-0.align-text-top
            input.custom-control-input(
              name="primaryInfo"
              type="radio"
              v-bind:value="index"
              v-model="primaryInfoIndex"
            )
            span.custom-control-indicator
      .form-row.tr
        .col-1.td
          button.btn-badge.btn-success(
            type="button"
            @click="addInfo"
          )
            span.oi.oi-plus
        .col-3.td
          item-title-selector(v-model="title_new")
        .col-8.td
          .input-group.input-group-sm
            input.form-control(
              type="text"
              placeholder="值"
              v-bind:class="{'is-invalid': errors.value_new}"
              v-model="value_new"
            )
            span.input-group-btn
              button.btn.btn-info(
                type="button"
                @click="generatePassword"
              ) RPG
          .invalid-feedback.mt-0(
            style="display: block"
            v-show="errors.value_new"
          ) {{errors.value_new}}
      .form-row
        .col
          .invalid-feedback.mt-0(
            style="display: block"
            v-show="errors.informations !== false"
          ) {{errors.informations}} 
      .form-row
        .col-1
        .col-auto
          small.form-text.text-muted
            span 关注的信息将显示在列表视图中
            br
            span 随机密码生成器的参数可在"系统设置"中配置
    button.btn.btn-primary(
      type="button"
      @click="addAccount"
    ) 确认
</template>
<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import {generatePassword} from '../../RPGA'

import TagPicker from '../../components/TagPicker.vue'
import ItemTitleSelector from '../../components/ItemTitleSelector.vue'

import router from '../../routes'
import Account from '../../store/Account'
import Tags from '../../enums/Tags'
export default {
  data(){
    return {
      enum_tags: Tags,

      name: '',
      tags: new Array(),
      informations: new Array(),
      primaryInfoIndex: 0,

      title_new: '',
      value_new: ''
    }
  },
  computed: {
    charset(){
      return this.$store.getters['randomPasswordGenerator/charset']
    },
    passwordLength(){
      return this.$store.state.randomPasswordGenerator.length
    }
  },

  validators: {
    name(val){
      if(val === '') return '名称不能为空。'
      let isExist = _.findIndex(this.$store.state.accounts.data, (el)=>el.name === val)
      if(isExist !== -1) return '该名称已存在。'
      else return false
    },

    informations(val){
      if(this.informations.length === 0) return '账户信息不能为空。'
      else return false
    },

    title_new(val){
      if(this.title_new === '') return '名称不能为空。'
      else return false
    },

    value_new(val){
      if(this.value_new === '') return '值不能为空。'
      else return false
    },
  },
  methods: {
    generatePassword(){
      this.value_new = generatePassword(this.charset, this.passwordLength)
    },
    addInfo(){
      if(this.validate(['title_new','value_new']) === false) return
      let regex = new RegExp(`^${this.title_new}(\\d*)\$`)
      let suffix = _
        .chain(this.informations)
        .filter((info)=>regex.test(info.title))
        .map((info)=>{
          let suffix = info.title.match(regex)
          return suffix[1] === '' ? 1 : parseInt(suffix[1])
        })
        .sortBy()
        .reduce((memo, i)=>{
          if(i > memo) return memo
          if(i === memo) return memo + 1
        }, 1)
        .value()
      if(suffix === 1) suffix = ''
      this.informations.push({
        title: this.title_new + suffix,
        value: this.value_new
      })
      this.value_new = ''
      this.resetValidator(['title_new','value_new'])
    },

    removeInfo(index){
      if(index >= 0 && index < this.informations.length){
        this.informations.splice(index, 1)
        let pi = this.primaryInfoIndex
        if(pi === index || pi >= this.informations.length) this.primaryInfoIndex = 0
      }
    },

    addAccount(){
      if(this.validate(['name','informations']) === false) return

      let newAccount = new Account()
      newAccount.name = this.name
      newAccount.informations = this.informations
      newAccount.tags = this.tags
      newAccount.primaryInfoIndex = this.primaryInfoIndex
      
      this.$store.commit('accounts/add', {newAccount})
      router.go(-1)
      this.$toast('添加成功', {className: 'et-custom'})
    }
  },
  components:{
    TagPicker,
    ItemTitleSelector
  }
}
</script>
<style lang="scss">
#newAccount{
  padding: 1.2rem 1.5rem;
  min-height: 480px;

  .tr{
    border-top: 1px solid #e9ecef;
  }
  .th,.td{
    font-size: 1rem;
    padding: 0.35rem;
    line-height: 1.8;
  }
  .th{
    color: #495057;
    background-color: #e9ecef;
    font-weight: bold;
  }

  button.btn-badge{
    color: #fff;
  }
}
</style>

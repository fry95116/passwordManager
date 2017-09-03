<template lang="pug">
doctype html
#newAccount
  form
    .form-group
      label 账户信息名称
      editable-text(v-model="account_new.name")
      .invalid-feedback.mt-0(
        style="display: block"
        v-show="errors.account_new.name !== false"
      ) {{errors.account_new.name}}
    .form-group
      label 标签
      .form-row
        .col-auto
          span.tag.mr-1(
            v-for="tag in account_new.tags"
            v-bind:key="tag"
            v-bind:style="{ 'background-color': enum_tags[tag].bgColor}"
          ) &nbsp;
        .col-auto
          tag-picker(
            btnStyle=""
            v-model="account_new.tags"
          )
            span.oi.oi-pencil
    .form-group
      .form-row
        .col-auto
          label 创建时间：
        .col {{createTime}}
      .form-row
        .col-auto
          label 最近修改时间：
        .col {{latestUpdateTime}}
    .form-group
      .form-row
        .col
          label 账户信息
      .form-row.tr
        .col-1.th
        .col-3.th 名称
        .col-6.th 值
        .col-2.th.text-right 关注
      .form-row.tr(
        v-for="(info, index) in account_new.informations"
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
              v-model="account_new.primaryInfoIndex"
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
            v-show="errors.account_new.informations !== false"
          ) {{errors.account_new.informations}}
    .form-row
      .col-auto
        button.btn.btn-primary(
          type="button"
          @click="update"
        ) 更新
      .col-auto
        button.btn.btn-secondary(
          type="button"
          @click="cancel"
        ) 取消
</template>
<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import {generatePassword} from '../../RPGA'

import TagPicker from '../../components/TagPicker.vue'
import ItemTitleSelector from '../../components/ItemTitleSelector.vue'
import EditableText from '../../components/EditableText.vue'

import router from '../../routes'
import Account from '../../store/Account'
import Tags from '../../enums/Tags'

export default {
  data(){
    let name = this.$route.params.name
    let account = _.find(this.$store.state.accounts.data, el => el.name === name)

    return {
      enum_tags: Tags,
      account_old: account,
      account_new: _.cloneDeep(account),
      title_new: '',
      value_new: ''
    }
  },
  computed: {
    createTime(){
      let date = new Date(this.account_new.time_create)
      return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    },
    latestUpdateTime(){
      let date = new Date(this.account_new.time_latestUpdate)
      return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    },
    charset(){
      return this.$store.getters['randomPasswordGenerator/charset']
    },
    passwordLength(){
      return this.$store.state.randomPasswordGenerator.length
    }
  },
  validators: {
    account_new:{
      name(val){
        if(val === '') return '名称不能为空。'
        let isExist = _.findIndex(this.$store.state.accounts.data, el =>el.name === val)
        if(isExist !== -1 && val !== this.account_old.name) return '该名称已存在。'
        else return false
      },
      informations(val){
        if(this.account_new.informations.length === 0) return '账户信息不能为空。'
        else return false
      }
    },
    title_new(val){
      if(this.title_new === '') return '名称不能为空。'
      else return false
    },
    value_new(val){
      if(this.value_new === '') return '值不能为空。'
      else return false
    }
  },
  methods: {
    generatePassword(){
      this.value_new = generatePassword(this.RPGC_charsets, this.RPGC_length)
    },
    addInfo(){
      if(this.validate(['title_new','value_new']) === false) return
      //生成后缀
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
      //添加
      this.account_new.informations.push({
        title: this.title_new + suffix,
        value: this.value_new
      })
      this.value_new = ''
      this.resetValidator(['title_new','value_new'])
    },
    removeInfo(index){
      if(index >= 0 && index < this.account_new.informations.length){
        this.account_new.informations.splice(index, 1)
        let pi = this.account_new.primaryInfoIndex
        if(pi === index || pi >= this.account_new.informations.length)
          this.account_new.primaryInfoIndex = 0
      }
    },
    update(){
      if(this.validate(['name','informations']) === false) return      

      this.$store.commit('accounts/update', {
        name: this.account_old.name,
        newAccount: this.account_new
      })

      router.go(-1)
      this.$toast('更新成功',{className: 'et-custom'})
    },
    cancel(){
      router.go(-1)
    }
  },
  components:{
    TagPicker,
    ItemTitleSelector,
    EditableText
  }
}
</script>
<style lang="scss">
#newAccount{
  padding: 1.2rem 1.5rem;
  min-height: 480px;

  label{
    font-weight: bold;
  }

  .form-control-plaintext{
    display: block;
    width: 100%;

    &+.btn-edit{
      font-size: 75%;
    }
  }

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

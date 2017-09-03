<template lang="pug">
.item-title-selector.input-group.input-group-sm
  .form-control(
    data-toggle="dropdown"
  )
    | {{val}}
  .dropdown-menu.dropdown-menu-right
    button.dropdown-item(
      type="button"
      v-for="title in enum_itemTitles"
      v-bind:key="title"
      @click="select(title)"
    )
      | {{title}}
    button.dropdown-item(
      type="button"
      @click="setCustomTitle()"
    ) 其他...
</template>
<script>
import _ from 'lodash'
import ItemTitles from '../enums/ItemTitles'
import {prompt} from '../modalDialog'

export default {
  props:{
    value: {
      type: String,
      default: 'null!' || ItemTitles[0]
    },
    btnStyle: {
      type: String,
      default: 'btn-default'
    }
  },
  created(){
    if(this.value === ''){
      this.select(ItemTitles[0])
    }
  },
  data(){
    return {
      val: this.value,
      enum_itemTitles: ItemTitles
    }
  },
  methods:{
    select(title){
      if(!_.includes(this.enum_itemTitles, title)) return
      this.val = title
      this.$emit('input', title)
    },
    async setCustomTitle(){
      let title = await prompt('请输入标题...')
      if(title === '') return
      this.val = title
      this.$emit('input', title)
    }
  }
}
</script>
<style lang="scss">
.item-title-selector{
  width: 100%;
  
  &.input-group div.form-control:not(:last-child){
    display: block;
    border-radius: 0.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 0.45rem;
    padding-right: 0.45rem;
  }
}
</style>

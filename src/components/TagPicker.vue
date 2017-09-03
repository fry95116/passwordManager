<template lang="pug">
.dropdown.show
  a(
    v-bind:class="btnStyle"
    data-toggle="dropdown"
    href="#"
  )
    slot
  .dropdown-menu
    button.dropdown-item(
      type="button"
      v-for="(tag, index) in enum_tags"
      v-bind:key="index"
      @click="toggle(index)"
    )
      span.tag.mr-3(v-bind:style="{ 'background-color': tag.bgColor}")
        span.oi.oi-check(v-if="isSelected(index)")
        span(v-else) &nbsp;
      span {{tag.name}}
</template>
<script>
import Tags from '../enums/Tags'
import _ from 'lodash'
export default {
  props:{
    value: {
      type: Array,
      default: ()=>new Array()
    },
    btnStyle: {
      type: String,
      default: 'btn btn-primary dropdown-toggle'
    }
  },
  data(){
    return {
      enum_tags: Tags,
    }
  },
  methods:{
    toggle(index){
      if(index < 0 || index >= this.enum_tags.length) return
      
      let newTags = _.clone(this.value)
      let pos = _.findIndex(newTags,(el)=>el === index)
      if(pos === -1) newTags.push(index)
      else newTags.splice(pos, 1)
      this.$emit('input', newTags)
    },
    isSelected(index){
      return _.includes(this.value, index)
    }
  }
}
</script>
<style lang="scss">

</style>

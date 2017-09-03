<template lang="pug">
.editable-text
  .input-group.editor(v-if="editing")
    input.form-control(
      name="name"
      :class="{ 'is-invalid': errorMsg }"
      type="text"
      v-model="newValue"
    )
    .ml-1
      button.btn.btn-primary(
        type="button"
        @click="updateValue"
      )
        span.oi.oi-check
    .ml-1
      button.btn.btn-secondary(
        type="button"
        @click="cancel"
      )
        span.oi.oi-x
    //- span.input-group-btn
    //-   button.btn.btn-secondary(type='button')
    //-     span.oi.oi-check
    //- span.input-group-btn
    //-   button.btn.btn-secondary(type='button')
    //-     | B
        //-span.oi.oi-x
  .form-control-plaintext(v-else)
    | {{val}}
    a.ml-3(
      href="#"
      @click.prevent="edit"
    )
      span.oi.oi-pencil
  .invalid-feedback {{errorMsg}}
</template>
<script>
import _ from 'lodash'
export default {
  props: {
    value: String,
    validator: {
      type: Function,
      default: ()=>{return null}
    }
  },

  data(){
    return {
      editing: false,
      errorMsg: null,
      val: this.value || '',
      newValue: ''
    }
  },

  methods:{
    updateValue(){
      //validate
      this.errorMsg = this.validator(this.newValue)
      if(_.isNil(this.errorMsg)){
        this.val = this.newValue
        this.$emit('input', this.newValue)
        this.editing = false
      }
    },
    edit(){
      this.newValue = this.val
      this.editing = true
    },
    cancel(){
      this.editing = false
    }
  }
}
</script>
<style lang="scss">
  .editable-text{
    input.form-control{
      border-top-right-radius: 0.25rem !important;
      border-bottom-right-radius: 0.25rem !important;
    }
  }
</style>

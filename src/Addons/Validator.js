/**
 * validators.attr: function(val)
 */

'use strict'
import _ from 'lodash'

export default {
  install(Vue, options) {
    Vue.mixin({
      created () {
        let self = this
        if(self.$options.validators){
          self.$validators = new Object()
          let validators = self.$options.validators

          let paths = flattenDeep(validators)
          for(let path in paths){
            if(_.has(self.$data, path)){
              let validator = _.get(validators, path)
              //添加属性              
              self.errors = Object.assign(_.set(new Object(), path, null), self.errors)
              //生成验证器
              _.set(self.$validators, path, ()=>{
                _.set(self.errors, path, validator.call(self, self.$data[path]))  
              })
              //添加watcher
              //todo: 改成可选
              self.$watch(path, value=>{
                _.set(self.errors, path, validator.call(self, value))
              })
            }
          }
        }
      },
      data(){
        return {
          errors:new Object()
        }
      },
      methods:{
        validate(attrs){
          if(!_.isArray(attrs)) attrs = _.keys(this.$validators)
          for(let attr of attrs) {
            if(this.$validators[attr]){
              this.$validators[attr]()
            }
          }
          for(let attr of attrs) {
            if(this.errors[attr]) return false
          }
          return true
        },
        resetValidator(attrs){
          if(!_.isArray(attrs)) attrs = _.keys(this.$validators)
          this.$nextTick(()=>{
            for(let attr of attrs) this.$set(this.errors, attr, null)              
          })
        }
      }
    })
  }
}

function flattenDeep(source, flatKey) {
  let newSource = {}
  if(_.isEmpty(source)){
    if(!_.isNil(flatKey)) newSource[flatKey] = source;
    return newSource
  }
  else 
    _.forOwn(source, (value, key) => {
      let currentFlatKey = flatKey ? `${flatKey}.${key}` : key

      if (_.isObject(value) || _.isArray(value)) newSource = Object.assign(newSource, flattenDeep(value, currentFlatKey))
      else newSource[currentFlatKey] = value
    })
    return newSource
}


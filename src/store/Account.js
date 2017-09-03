import _ from 'lodash'

export default class Account{
  constructor(arg0){
    if(_.isString(arg0)){
      this.name = arg0
      this.tags = new Array()
      this.informations = new Array()
      this.primaryInfoIndex = 0
      this.time_create = _.now()
      this.time_latestUpdate = _.now()
    }
    else if(_.isObject(arg0)){
      this.name = arg0.name
      this.tags = arg0.tags || new Array()
      this.informations = arg0.informations || new Array()
      this.primaryInfoIndex = arg0.primaryInfoIndex || 0
      this.time_create = arg0.time_create || _.now()
      this.time_latestUpdate = arg0.time_latestUpdate || _.now()
    }
  }

  setInfo(title, value){
    var pos = _.findIndex(this.informations, el=>el.title === title)
    if(pos !== -1) this.informations[pos].value = value
    else this.informations.push({title, value})
  }
  
  get primaryInfo(){
    return this.informations[this.primaryInfoIndex]
  }

  set primaryInfo(title){
    var pos = _.findIndex(this.informations, (el)=>el.title === title)
    if(pos !== -1) this.primaryInfoIndex = pos
  }
}
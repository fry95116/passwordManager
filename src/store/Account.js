import _ from 'lodash'

export default class Account{
  constructor(arg0){
    this.name = arg0
    this.tags = new Array()
    this.informations = new Array()
    this.primaryInfoIndex = 0
    this.time_create = _.now()
    this.time_latestUpdate = _.now()
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

  /**
   * 序列化一个account对象
   * @param {Account} account - 需要被序列化的Account对象
   * @return {string} - 序列化后的Account对象(字符串)
   */
  static stringify(account){
    return JSON.stringify(account)
  }
  
  /**
   * 反序列化一个Account对象
   * @param {string} str - 序列化的Account对象(字符串)
   * @return {Account} - 解析出来的Account对象
   */
  static parse(str){
    try{
      let src = JSON.parse(str)
    }
    catch(e){
      throw new Error(`error on parsing Account: ${e.msg}`)
    }
    let res = new Account()
    let keys = ['name', 'tags', 'informations', 'primaryInfoIndex', 'time_create', 'time_latestUpdate']
    
    _.each(keys, (key)=>{
      if(_.isUndefined(src[key]))
        throw new Error(`error on constructing Account: missing attribute "${key}"`)
      else res[key] = src[key]
    })
    
    return res
  }
}
import { RSAChiper } from './Chipers/RSAChiper.js'
const CHIPERS = {
  RSAChiper
}

export class ChiperFactory{
  static serialize(chiper){
    for (let chiperName in CHIPERS){
      if(chiper instanceof CHIPERS[chiperName]){
        return JSON.stringify({
          chiperName,
          data: CHIPERS[chiperName].serialize(chiper)
        })
      }
    }
  }

  static deserialize(str){
    try{
      let res = JSON.parse(str)
      if(res && res.chiperName){
        if (CHIPERS[res.chiperName]) return CHIPERS[res.chiperName].deserialize(res.data)
        else throw new Error(res.chiperName + ' is not supported')
      }
      else throw new Error('attribute "chiperName" is undefined')
    }
    catch(e){
      throw new Error('deserialize chiper failed:' + err.message)
    }
  }

  static getAvaliableChiperNames(){
    let res = []
    for (let chiperName in CHIPERS) res.push(chiperName)
    return res
  }

  static getChiperClass(chiperName){
    if(CHIPERS[chiperName]){
      return CHIPERS[chiperName]
    }
  }
}
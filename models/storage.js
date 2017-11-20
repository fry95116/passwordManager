import {isNil, isNotNil, getStorage, strToBase64, base64ToStr} from '../utils/util.js'
import {Infos} from './Infos.js'
import {ChiperFactory} from './ChiperFactory.js'
import {Settings} from './Settings.js'

const MODELS = {
  'infos': Infos,
  'chiper': ChiperFactory,
  'settings': Settings
}

export function push(key, APP){
  APP = APP || getApp()
  if(isNil(key)) for (let key in MODELS) push(key)
  else if (MODELS[key] !== -1){
    let data = MODELS[key].serialize(APP[key])
    wx.setStorage({key, data})
  }
}

export function pull(key, APP){
  APP = APP || getApp()
  console.log(wx.getStorageInfoSync())
  if(isNil(key)){
    let res = []
    for(let key in MODELS) res.push(pull(key, APP))
    return Promise.all(res)
  }
  else if(MODELS[key] !== -1){
    return new Promise((resolve, reject)=>{
      getStorage(key)
      .then((res)=>{
        APP[key] = MODELS[key].deserialize(res.data)
        resolve()
      })
      .catch((e)=>{
        console.info(new Error('[' + key + ']' + e.message))
        reject(e)
      })
    })
  }
}

export function clearAll(){
  wx.clearStorage()  
}

export function exportBase64(){
  const APP = getApp()
  let res = {}
  for (let key in MODELS){
    res[key] = MODELS[key].serialize(APP[key])
  }
  return strToBase64(JSON.stringify(res))
}

export function fromBase64(str){
  const APP = getApp()

  let src = JSON.parse(base64ToStr(str))
  for(let key in MODELS){
    if(src[key]){
      APP[key] = MODELS[key].deserialize(src[key])
    }
    else throw new Error('can not find "' + key + '"')
  }

  push()
}
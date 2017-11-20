//app.js
import { Chiper } from 'models/Chipers/Chiper'
import { Infos } from 'models/Infos.js'
import { Settings } from 'models/Settings.js'
import {pull} from '/models/storage.js'

const KEY_STORAGE = 'model'
App({
  infos: null, 
  chiper: null,
  settings: null
})
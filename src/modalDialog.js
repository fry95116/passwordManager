import _ from 'lodash'

'use strict'

class Alert{
  constructor(){
    let templates = 
    `
    <div id="modalDialog" class="modal fade" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-body"> 
            <div class="container-fiuld">
              <div class="row">
                <div class="col-auto">
                  <div class="message"></div>
                </div>
              </div>
              <div class="row justify-content-end action-btns">
                <div class="col-auto">
                  <button class="btn btn-outline-primary" type="button" data-action="ok">
                    确定
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
    this.action = ''
    this.cb = null

    this.$el = $(templates)
    this.$el.modal({
      backdrop: 'static',
      keyboard: false,
      focus: false,
      show: false
    })
    this.$el.find('[data-action]').click((el)=>{
      let $this = $(el.currentTarget)
      this.action = $this.attr('data-action')
      this.$el.modal('hide')
    })
    this.$el.on('hidden.bs.modal', ()=>{
      this.$el.detach()
      if(typeof(this.cb) === 'function') this.cb(this.action)
      this.action = ''
    })
  }
  
  show(msg, cb){
    let oldDialog = $('#modalDialog')
    if(oldDialog.length !== 0) oldDialog.detach()
    
    this.cb = cb
    this.$el.find('.message').text(msg)
    this.$el.appendTo('body')
    this.$el.modal('show')
  }

  showAsync(msg){
    return new Promise((resolve)=>{
      this.show(msg, resolve)
    })
  }
}

class Confirm{
  constructor(){
    let templates = 
    `
    <div id="modalDialog" class="modal fade" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-body"> 
            <div class="container-fiuld">
              <div class="row">
                <div class="col-auto">
                  <div class="message"></div>
                </div>
              </div>
              <div class="row justify-content-end action-btns">
                <div class="col-auto">
                <button class="btn btn-outline-primary" type="button" data-action="ok">
                  确定
                </button>
                <button class="btn btn-outline-secondary" type="button" data-action="cancel">
                  取消
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
    this.action = ''
    this.cb = null

    this.$el = $(templates)
    this.$el.modal({
      backdrop: 'static',
      keyboard: false,
      focus: false,
      show: false
    })
    this.$el.find('[data-action]').click((el)=>{
      let $this = $(el.currentTarget)
      this.action = $this.attr('data-action')
      this.$el.modal('hide')
    })
    this.$el.on('hidden.bs.modal', ()=>{
      this.$el.detach()
      if(typeof(this.cb) === 'function') this.cb(this.action)
      this.action = ''
    })
  }
  
  show(msg, cb){
    let oldDialog = $('#modalDialog')
    if(oldDialog.length !== 0) oldDialog.detach()
    
    this.cb = cb
    this.$el.find('.message').text(msg)
    this.$el.appendTo('body')
    this.$el.modal('show')
  }

  showAsync(msg){
    return new Promise((resolve)=>{
      this.show(msg, resolve)
    })
  }
}

class Prompt{
  constructor(){
    let templates = 
    `
    <div id="modalDialog" class="modal fade" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-body"> 
            <div class="container-fiuld">
              <div class="row">
                <div class="col-auto">
                  <div class="message"></div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <input name="text" class="text form-control">
                </div>
              </div>
              <div class="row justify-content-end action-btns">
                <div class="col-auto">
                <button class="btn btn-outline-primary" type="button" data-action="ok">
                  确定
                </button>
                <button class="btn btn-outline-secondary" type="button" data-action="cancel">
                  取消
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
    this.action = ''
    this.cb = null

    this.$el = $(templates)
    this.$el.modal({
      backdrop: 'static',
      keyboard: false,
      focus: false,
      show: false
    })
    this.$el.find('[data-action]').click((el)=>{
      let $this = $(el.currentTarget)
      this.action = $this.attr('data-action')
      this.$el.modal('hide')
    })
    this.$el.on('hidden.bs.modal', ()=>{
      let data_re = this.$el.find('input.text').val()
      this.$el.detach()
      if(this.action === 'ok' && typeof(this.cb) === 'function'){
          this.cb(data_re)
      }
      this.action = ''
    })
  }
  
  show(msg, defaultText, cb){
    let oldDialog = $('#modalDialog')
    if(oldDialog.length !== 0) oldDialog.detach()
    
    this.cb = cb
    this.$el.find('.message').text(msg)
    this.$el.find('input.text').val(defaultText)
    this.$el.appendTo('body')
    this.$el.modal('show')
  }

  showAsync(msg, defaultText){
    return new Promise((resolve)=>{
      this.show(msg, defaultText, resolve)
    })
  }
}

let $dialogs = {
  alert: new Alert(),
  confirm: new Confirm(),
  prompt: new Prompt()
}

export async function alert(msg){
  return await $dialogs.alert.showAsync(msg)
}

export async function confirm(msg){
  return await $dialogs.confirm.showAsync(msg)
}

export async function prompt(msg, defaultText = ''){
  return await $dialogs.prompt.showAsync(msg, defaultText)
}

(function () {

    const util = require('./util.js')
    const jsqr = require('jsqr')

    class QRreader {
        constructor(opt) {
            
            this._isFront = false
            this._stride = Math.round(Math.min(window.innerHeight, window.innerWidth) * 0.618)
            this._frame = null
            this._display = null
            this._image = null
            this._canvas = null
            this._ctx = null
            this._fileInput = null

            // this._timer_id = -1
            this._isHiding = true
            this._isCapturing = false
            this.switchDevice = true
            this.readFromAlbum = true

            if (typeof opt !== 'undefined'){
                if (typeof opt.switchDevice !== 'undefined')
                    this.switchDevice = opt.switchDevice
                if (typeof opt.readFromAlbum !== 'undefined')
                    this.readFromAlbum = opt.readFromAlbum
            }

            var template = ''
                + '<video autoplay="autoplay" muted="muted" playsinline></video>'
                + '<canvas id="canvas" style="display:none"></canvas>'
                + '<div class="content-center">'
                    + '<div class="aperture">'
                        + '<div class="scan-line"></div>'
                        + '<div class="vertex left-bottom"></div>'
                        + '<div class="vertex right-bottom"></div>'
                        + '<div class="vertex left-top"></div>'
                        + '<div class="vertex right-top"></div>'
                    + '</div>'
                    + '<div class="tips">将二维码放入取景框中</div>'
                + '</div>'
                + '<button class="btn btn-cancel">&lt; 返回</button>'

            this._frame = document.createElement('div')
            this._frame.className = 'QRreader-mask'
            this._frame.style.display = 'none'
            this._frame.innerHTML = template

            this._display = this._frame.getElementsByTagName('video')[0] || null
            this._canvas = this._frame.getElementsByTagName('canvas')[0]
            this._ctx = this._canvas.getContext('2d');

            var aperture = this._frame.getElementsByClassName('aperture')[0]
            aperture.style.width = this._stride + 'px'
            aperture.style.height = this._stride + 'px'

            if (this.switchDevice) {
                var btn_switch = document.createElement('button')
                btn_switch.className = 'btn btn-switch'
                btn_switch.innerText = '切换设备'
                btn_switch.addEventListener('click', ()=>{
                    this._isFront = !this._isFront
                    this._setCamera(this._isFront)
                })
                this._frame.appendChild(btn_switch)
            }
            
            if (this.readFromAlbum) {
                var btn_album = document.createElement('label')
                btn_album.className = 'btn btn-album'
                btn_album.setAttribute('for', 'QRreader-file-input')
                btn_album.innerText = '相册'
                this._frame.appendChild(btn_album)
            }

            this._frame.getElementsByClassName('btn-cancel')[0].addEventListener('click', ()=>{
                this._clearCapture()
                this._hideFrame()
            })

            document.body.appendChild(this._frame)
            
            this._fileInput = document.createElement('input')
            this._fileInput.setAttribute('id', 'QRreader-file-input')
            this._fileInput.setAttribute('type', 'file')
            this._fileInput.setAttribute('accept', 'image/*')
            this._fileInput.setAttribute('capture', 'camera')
 
            document.body.appendChild(this._fileInput)
        }

        hook(el, onDetected){
            if(el.tagName.toUpperCase() !== 'LABEL'){
                throw new Error('must be hooked on a <label> element!')
                return
            }
            el.setAttribute('for', 'QRreader-file-input')
            // if(false){
            if(util.getMediaDevices() !== null){
                // read image from camera
                var doOnClick = async ()=>{
                    
                    var ret = null

                    try{
                        await this._setCamera()
                        this._showFrame()

                        if(this.readFromAlbum){

                            var readFromFileInputOnce = new Promise((resolve)=>{
                                var onChange = async (e)=>{
                                    this._fileInput.removeEventListener('change', onChange)
                                    if(this._fileInput.files.length === 0) return
                                    var ret = await this._readQRcodeFromFile(this._fileInput.files[0])
                                    resolve(ret)
                                }
                                this._fileInput.addEventListener('change', onChange)
                            })
                            
                            ret = await Promise.race([
                                readFromFileInputOnce,
                                this._startCapture()
                            ])
                        }
                        else{
                            ret = await this._startCapture()
                        }
                    }
                    catch(err){
                        console.log(err)
                        return
                    }

                    var isCancel = this._isHiding
                    this._clearCapture()
                    this._hideFrame()

                    if(ret && ret.data) ret = ret.data
                    else ret = null

                    await util.sleep(10)
                    if(!isCancel && onDetected) onDetected(ret)
                }
                el.onclick = function(){
                    doOnClick()
                    return false;
                }
            }
            else{
                // read image from file
                el.onclick = null
                //TODO: onchange的修改可能会造成内存泄漏

                var doOnChange = async()=>{
                    if(this._fileInput.files.length === 0) return
                    var ret = await this._readQRcodeFromFile(this._fileInput.files[0])

                    if(ret && ret.data) ret = ret.data
                    else ret = null

                    if(onDetected) onDetected(ret)
                }
                this._fileInput.addEventListener('change', doOnChange)
            }
        }

        async _readQRcodeFromFile(file){

            try{
                var dataUrl = await util.castFileToDataUrl(file)
                var img = await util.castDataUrlToImage(dataUrl)
            }
            catch(err){
                console.log(err)
                return null
            }

            var width_canvas = img.width
            var height_canvas = img.height

            this._canvas.setAttribute('width', width_canvas + 'px')
            this._canvas.setAttribute('height', height_canvas + 'px')

            this._ctx.drawImage(img, 0, 0)

            var imageData = this._ctx.getImageData(0, 0, width_canvas, height_canvas)
            var ret = jsqr(imageData.data, width_canvas, height_canvas)
            
            return ret
        }

        /**
         * 根据`this.switchDevice`和`this._isFront`选择摄像头，并将视频流推送至this._display中
         */
        async _setCamera() {
            var mediaDevices = util.getMediaDevices()
            if (mediaDevices === null)
                reject('mediaDevices API not supported')
            else {
                var constraints = this.CONSTRAINTS_DEFAULT
                if (this.switchDevice) {
                    constraints = this._isFront ? this.CONSTRAINTS_CAMERA_FRONT : this.CONSTRAINTS_CAMERA_BACK
                }
                try{
                    var stream = await mediaDevices.getUserMedia(constraints)
                    this._display.srcObject = stream
                    return
                }
                catch(err) {throw err}
            }
        }

        _showFrame() {
            this._frame.style.display = 'block'
            this._isHiding = false
        }


        async _startCapture() {
                //TODO: 监听this._display.onloadedmetadata
                await util.waitUntil(() => {
                    return this._display.videoWidth !== 0 
                        && this._display.videoHeight !== 0;
                }, 2000)
                // may be throw timeout error 
                var width_canvas = this._display.videoWidth
                var height_canvas = this._display.videoHeight

                this._canvas.setAttribute('width', width_canvas + 'px')
                this._canvas.setAttribute('height', height_canvas + 'px')

                if(this._ctx === null) return
                this._clearCapture()

                this._isCapturing = true
                this._ctx.clearRect(0, 0, width_canvas, height_canvas)
                while(this._isCapturing){
                    await util.sleep(500)
                    this._ctx.drawImage(this._display, 0, 0)
                    var imageData = this._ctx.getImageData(0, 0, width_canvas, height_canvas)
                    var ret = jsqr(imageData.data, width_canvas, height_canvas)
                    if(ret !== null) return ret
                    // TODO: process image
                }
                return null
        }

        _clearCapture() {
            this._isCapturing = false
        }

        _hideFrame() {
            if (this._display !== null)
                this._display.srcObject = null
            this._frame.style.display = 'none'
            this._isHiding = true
        }
    }

    QRreader.prototype.CONSTRAINTS_DEFAULT      = { video: true, audio: false }
    QRreader.prototype.CONSTRAINTS_CAMERA_FRONT = { video: { facingMode: 'user' }, audio: false }
    QRreader.prototype.CONSTRAINTS_CAMERA_BACK  = { video: { facingMode: 'environment' }, audio: false }

    if(module && module.exports) module.exports = new QRreader()
    else if(window) window.qrReader = new QRreader()

})()
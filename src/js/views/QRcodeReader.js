var Vue = require('vue')
var jsqr = require('jsqr')

var util = require('../libs/util')

var QRcodeReader = new Vue({
    el: '#QRcode-reader',
    template: `
        <transition name="scale-center">
        <div id="QRcode-reader" v-show="!hidden">
            <video autoplay="autoplay" muted="muted" playsinline></video>
            <div class="content-center">
                <div class="aperture" v-bind:style="{width: stride + 'px', height: stride + 'px'}">
                    <div class="scan-line"></div>
                    <div class="vertex left-bottom"></div>
                    <div class="vertex right-bottom"></div>
                    <div class="vertex left-top"></div>
                    <div class="vertex right-top"></div>
                </div>
                <div class="tips">将二维码放入取景框中</div>
            </div>
            <button class="btn btn-cancel">&lt; 返回</button>
            <button v-if="btn_switchCamera" class="btn btn-switch" @click="switchCamera">切换设备</button>
            <button v-if="btn_readFromAlbum" class="btn btn-album" @click="readFromAlbum">相册</button>

            <input v-if="!support_UserMedia" class="fileReader-camera" type="file" accept="image/*" capture="camera">
            <input v-if="btn_readFromAlbum" class="fileReader-fileSystem" type="file" accept="image/*">
        </div>
        </transition>
    `,
    data:{
        hidden: true,
        btn_switchCamera: true,
        btn_readFromAlbum: true,
        isFront: true
    },
    computed:{
        support_UserMedia(){
            return util.getMediaDevices() !== null
        },
        stride(){
            return Math.round(Math.min(window.innerHeight, window.innerWidth) * 0.618)
        }
    },

    methods:{
        async readQRcode(){
            if(this.support_UserMedia){
                var el_video = this.$el.querySelector('video')
                var el_fileInput = this.$el.querySelector('.fileReader-fileSystem')
                try{
                    await this.selectCamera()
                }
                catch(err){
                    throw err
                }
                this.hidden = false

                var cameraQRcodeCatcher = new CameraQRcodeCatcher(el_video)
                var fileQRcodeCatcher = new FileQRcodeCatcher(el_fileInput)

                var qrcode = await Promise.race([
                    cameraQRcodeCatcher.start(),
                    fileQRcodeCatcher.start(),
                    this.captureFromCancelButton()
                ])
                cameraQRcodeCatcher.stop()
                fileQRcodeCatcher.stop()
                el_video.srcObject = null
                this.hidden = true

                return qrcode
            }
            else{
                this.$el.querySelector('.fileReader-camera').click()
            }
        },

        captureFromCancelButton(){
            return new Promise((resolve)=>{
                var button_cancel = this.$el.querySelector('.btn-cancel')
                button_cancel.addEventListener('click', onClick)
                function onClick(){
                    button_cancel.removeEventListener('click', onClick)
                    resolve(null)
                }
            })
        },

        readFromAlbum(){
            this.$el.querySelector('.fileReader-fileSystem').click()
        },

        async switchCamera(){
            this.isFront = !this.isFront
            //TODO:add try catch
            await this.selectCamera()
        },

        async selectCamera(){
            //TODO: facingMode的支持性问题
            // const CONSTRAINTS_DEFAULT = { video: true, audio: false }
            const CONSTRAINTS_CAMERA_FRONT = { video: { facingMode: 'user' }, audio: false }
            const CONSTRAINTS_CAMERA_BACK  = { video: { facingMode: 'environment' }, audio: false }

            var mediaDevices = util.getMediaDevices()
            if (mediaDevices === null) throw new Error('mediaDevices API not supported')

            // var constraints = CONSTRAINTS_DEFAULT
            var constraints = this.isFront ? CONSTRAINTS_CAMERA_FRONT : CONSTRAINTS_CAMERA_BACK
            try{
                var stream = await mediaDevices.getUserMedia(constraints)
            }
            catch(err) {
                throw err
            }
            await this.setStream(stream)
        },

        setStream(stream){
            return new Promise((resolve)=>{
                var el_video = this.$el.querySelector('video')
                el_video.srcObject = stream
                el_video.onloadedmetadata = ()=>{
                    this.width_canvas = el_video.videoWidth
                    this.height_canvas = el_video.videoHeight
                    resolve()
                }
            })
        }
    }    
})

class CameraQRcodeCatcher{
    /**
     * 从视频源中捕获图像并解析出QRcode
     * @param {HTMLVideoElement} video - 捕获源 
     */
    constructor(video){
        this.video = video
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')
        this.ROI = {left: 0, top: 0, width: 0, height: 0}
        this._isCapturing = false
        
    }

    /**
     * 开始捕获
     */
    async start(){
        this._isCapturing = true
        this._updateROI()

        while(this._isCapturing){
            await util.sleep(500)
            if(this.video.videoWidth !== this.canvas.width || this.video.videoHeight !== this.canvas.height) this._updateROI()

            this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)

            // var imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
            // var ret = jsqr(imageData.data,this.canvas.width, this.canvas.height)

            var imageData = this.context.getImageData(this.ROI.left, this.ROI.top, this.ROI.width, this.ROI.height)
            var ret = jsqr(imageData.data, this.ROI.width, this.ROI.height)

            if(ret && ret.data) return ret.data
        }
    }

    /** 停止捕获 */
    stop(){
        this._isCapturing = false
    }

    /** 计算ROI */
    _updateROI(){
        var width_video = this.video.videoWidth
        var height_video = this.video.videoHeight
        var ratio_video = width_video / height_video

        var width_window = window.innerWidth
        var height_window = window.innerHeight
        var ratio_window = width_window / height_window

        if(ratio_video > ratio_window){
            this.ROI.height = height_video
            this.ROI.width = Math.floor(height_video * ratio_window)
            this.ROI.left = 0
            this.ROI.top = 0
        }
        else{
            this.ROI.width = width_video
            this.ROI.height = Math.floor(width_video / ratio_video)
            this.ROI.left = 0
            this.ROI.top = height_video - this.ROI.height
        }
        this.canvas.width = width_video
        this.canvas.height = height_video
    }
}

class FileQRcodeCatcher{
    constructor(fileInput){
        this.fileInput = fileInput
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')
    }

    start(){
        return new Promise((resolve)=>{        
            var _onChange = async ()=>{
                this.fileInput.onchange = null
                if(this.fileInput.files.length === 0) return null
                
                var file = this.fileInput.files[0]
                try{
                    var dataUrl = await this._toDataUrl(file)
                    var img = await this._toImage(dataUrl)
                }
                catch(err){
                    console.log(err)
                    return null
                }

                var width_canvas = img.width
                var height_canvas = img.height

                this.canvas.width = width_canvas
                this.canvas.height = width_canvas

                this.context.drawImage(img, 0, 0)

                var imageData = this.context.getImageData(0, 0, width_canvas, height_canvas)
                var ret = jsqr(imageData.data, width_canvas, height_canvas)
                
                // var ret = await this._readQRcodeFromFile(this._fileInput.files[0])

                if(ret && ret.data) ret = ret.data
                else ret = null

                resolve(ret)
            }
            this.fileInput.onchange = _onChange
        })
    }

    stop(){
        this.fileInput.onchange = null
    }


    _toDataUrl(file){
        return new Promise(function(resolve, reject){
            var fileReader = new FileReader()
            fileReader.onload = function(){
                resolve(this.result)
            }
            fileReader.readAsDataURL(file)
        })
    }
    
    _toImage(dataUrl){
        return new Promise(function(resolve, reject){
            var ret = new Image()
            ret.onload = function(){
                resolve(ret)
            }
            ret.onerror = reject
            ret.src = dataUrl
        })
    }
}

module.exports = QRcodeReader
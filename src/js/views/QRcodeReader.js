var Vue = require('vue')

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
            <button class="btn btn-cancel" @click="cancel">&lt; 返回</button>
            <button v-if="btn_switchCamera" class="btn btn-switch" @click="switch">切换设备</button>
            <button v-if="btn_readFromAlbum" class="btn btn-album">相册</button>

            <canvas style="display:none"></canvas>
            <input v-if="!support_UserMedia" class="fileReader-camera" type="file" accept="image/*" capture="camera">
            <input v-if="readFromAlbum" class="fileReader-fileSystem" type="file" accept="image/*">
        </div>
        </transition>
    `,
    data:{
        hidden: true,
        btn_switchCamera: true,
        btn_readFromAlbum: true,
        $_isFront: true
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
                var mediaDevices = util.getMediaDevices()
                // if (mediaDevices === null) throw new Error('mediaDevices API not supported')
                await this.setCamera()
                this.hidden = false
            }
            else{
                this.$el.querySelector('.fileReader-camera').click()
            }
        },

        cancel(){
            this.$el.querySelector('video').srcObject = null
            this.hidden = true
        },

        async switchCamera(){
            this.$_isFront = !this.$_isFront
            //TODO:add try catch
            await this.setCamera()
        },

        async setCamera(){
            //TODO: facingMode的支持性问题
            // const CONSTRAINTS_DEFAULT = { video: true, audio: false }
            const CONSTRAINTS_CAMERA_FRONT = { video: { facingMode: 'user' }, audio: false }
            const CONSTRAINTS_CAMERA_BACK  = { video: { facingMode: 'environment' }, audio: false }

            // var constraints = CONSTRAINTS_DEFAULT
            var constraints = this.$_isFront ? CONSTRAINTS_CAMERA_FRONT : CONSTRAINTS_CAMERA_BACK
            try{
                var stream = await mediaDevices.getUserMedia(constraints)
            }
            catch(err) {
                throw err
            }
            this.$el.querySelector('video').srcObject = stream
        }
    }
})



module.exports = QRcodeReader
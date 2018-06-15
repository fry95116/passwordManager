var QRcode = require('qrcode')
var RSAKey = require('../../libs/rsa')
var {passwordBooks} = require('../../models/passwordBooks')
var dropDown = require('./dropdown')
/* <input type="text" placeholder="RSA-1024">
<span class="caret"></span> */

var newPasswordBook = {
    name: 'newPasswordBook',
    template:`
        <section id="newPasswordBook" class="major-function">
            <div class="title-bar">
                <h1 class="title-main">{{ title }}</h1>
            </div>
            <transition name="fade-swap">
                <div v-if="!showQRcode" key="edit">
                    <div class="input-group">
                        <label>Name</label>
                        <div class="input-wrapper" v-bind:class="{'with-error': error_name}">
                            <input type="text" placeholder="PasswordBook's name" v-model="name">
                            <div class="msg-err">name required</div>
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Encrypt Algorithm</label>
                        <div class="input-wrapper">
                            <dropDown placeholder="default:RSA-1024" 
                                    v-bind:options="encryptAlgorithms" 
                                    v-model="encryptAlgorithm">
                            </dropDown>
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Error Correction Level</label>
                        <div class="input-wrapper">
                            <dropDown placeholder="default: M" 
                                    v-bind:options="errorCorrectionLevels" 
                                    v-model="errorCorrectionLevel">
                            </dropDown>
                        </div>
                    </div>
                    <div class="input-group">
                        <button v-if="generating === false" class="btn-block" @click="generateQRcode">Generate Keygen</button>
                        <button v-else class="btn-block" @click="generateQRcode">Generating...</button>
                    </div>
                </div>
                <div v-else key="preview">
                    <div class="QRcode-wrapper">
                        <img v-bind:src="QRcode">
                        <div class="indicate">[Long press to save it]</div>
                    </div>
                    <div class="warning-msg">
                        <h4>WARNING</h4>
                        <p>
                            This code is the only way to decrypt<br>
                            Print it as soon as possible, and keep it property
                        </p>
                    </div>
                    <div class="input-group">
                        <button class="btn-block">I have saved it</button>
                        <button class="btn-block btn-cancel" @click="showQRcode=false">Modify settings</button>
                    </div>
                </div>
            </transition>
        </section>
    `,
    data(){
        return{
            title: 'Create',
            encryptAlgorithms:{
                'RSA-1024':'RSA-1024'
            },
            errorCorrectionLevels:{
                L:'Low', 
                M:'Medium',
                Q:'Quartile',
                H:'High'
            },
            name: '',
            encryptAlgorithm:'RSA-1024',
            errorCorrectionLevel: 'M',
            
            passwordBook_new: null,
            
            error_name: false,
            showQRcode: false,
            generating: false
        }
    },
    computed:{
        QRcode(){
            if(this.passwordBook_new instanceof PasswordBook){
                return this.passwordBook_new.getPrivate_encrypted()
            }
            else{
                return ''
            }
        }
    },
    methods:{
        async generateQRcode(){
            if(this.name === ''){
                this.error_name = true
                return
            }
            else this.error_name = false


            this.generating = true
            await this.$nextTick()

            var newKeygen = new RSAKey()
            newKeygen.generate(1024, '10001')
            var keygen = newKeygen.getPrivate_encrypted()

            try{
                var dataUrl = await QRcode.toDataURL(keygen,{
                    errorCorrectionLevel:this.errorCorrectionLevel
                })
                this.QRcode = dataUrl
    
                this.generating = false
                await this.$nextTick()
                
                this.showQRcode = true
            }
            catch(err){
                console.log(err)                
                this.QRcode = ''

                this.generating = false
                await this.$nextTick()

                this.showQRcode = false
            }
        }
    },

    mounted(){
        this.$emit('setActionBar', {
            title: this.title,
            button_left: {
                text: '< Back',
                callback: ()=>{
                    this.$emit('route', 'passwordBooks')
                }
            },
            button_right: null
        })
        this.$emit('setToolBar', null)
    },

    components:{
        dropDown
    }
}

module.exports = newPasswordBook
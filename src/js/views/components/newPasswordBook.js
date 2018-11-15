var QRcode = require('qrcode')
var RSAKey = require('../../libs/rsa')
var passwordBooks = require('../../models/passwordBooks')
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
                        <div class="input-wrapper" v-bind:class="{'with-error': errMsg !== ''}">
                            <input type="text" placeholder="PasswordBook's name" v-model="name">
                            <div class="msg-err">{{errMsg}}</div>
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
                        <button class="btn-block" v-if="!generating" @click="generateKeygen">Generate Keygen</button>
                        <button class="btn-block" v-else>Generating...</button>
                    </div>
                </div>
                <div v-else key="preview">
                    <div class="QRcode-wrapper">
                        <img v-bind:src="dataUrl_QRcode">
                        <div class="indicate">[ Long press to save it ]</div>
                    </div>
                    <div class="warning-msg">
                        <h4>WARNING</h4>
                        <p>
                            This code is the only way to decrypt<br>
                            Print it as soon as possible, and keep it property
                        </p>
                    </div>
                    <div class="input-group">
                        <button class="btn-block" @click="createPasswordBook">I have saved it</button>
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
            
            keygen: new RSAKey(),
            dataUrl_QRcode: '',

            errMsg: '',
            showQRcode: false,
            generating: false
        }
    },
    methods:{
        generateKeygen(){
            // 输入检查
            if(this.name === ''){
                this.errMsg = 'name required'
                return
            }
            else if(this.name in passwordBooks.data){
                this.errMsg = 'name exists'
                return
            }
            else this.errMsg = ''

            // 生成新的密码本
            this.generating = true
            
            setTimeout(()=>{
                this.keygen.generate(1024, '10001')
                QRcode.toDataURL(this.keygen.getPrivate_encrypted(), {
                    errorCorrectionLevel:this.errorCorrectionLevel
                })
                .then((dataUrl)=>{
                    this.dataUrl_QRcode = dataUrl
                    this.showQRcode = true
                })
                .catch((err)=>{
                    console.log(err)
                    this.dataUrl_QRcode = ''
                    this.showQRcode = false
                })
                .finally(()=>{
                    this.generating = false
                })
            }, 20)
        },

        createPasswordBook(){
            try{
                passwordBooks.addPasswordBook({
                    name: this.name,
                    keygen: this.keygen
                })
                // passwordBooks.add(new PasswordBook(this.name, this.keygen))
                this.$emit('route', 'passwordBooks')
            }
            catch(err){console.error('name exist')}

        }
    },

    mounted(){
        this.$emit('setActionBar', {
            title: this.title,
            button_right: {
                text: 'Back >',
                callback: ()=>{
                    this.$emit('route', 'passwordBooks')
                }
            },
            button_left: null
        })
        this.$emit('setToolBar', null)
    },

    components:{
        dropDown
    }
}

module.exports = newPasswordBook
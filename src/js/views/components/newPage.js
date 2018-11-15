var dropDown = require('./dropdown')
var passwordBooks = require('../../models/passwordBooks')
/* <input type="text" placeholder="RSA-1024">
<span class="caret"></span> */

var newPage = {
    name: 'newPage',
    template:`
        <section id="newPage" class="major-function">
            <div class="title-bar">
                <h1 class="title-main">{{ title }}</h1>
            </div>
            <div>
                <div class="input-group">
                    <label>Name</label>
                    <div class="input-wrapper" v-bind:class="{'with-error': errMsg_name !== ''}">
                        <input type="text" placeholder="Page's name" v-model="name" @blur="validateName">
                        <div class="msg-err">{{errMsg_name}}</div>
                    </div>
                </div>
                <div class="input-group">
                    <label>Password</label>
                    <div class="input-wrapper" v-bind:class="{'with-error': errMsg_password !== ''}">
                        <input type="text" placeholder="Password" v-model="primaryInfo" @blur="validatePrimaryInfo">
                        <div class="msg-err">{{errMsg_password}}</div>
                    </div>
                </div>
                <div class="input-group">
                    <label>Remark</label>
                    <div class="input-wrapper">
                        <textarea placeholder="remark">
                        </textarea>
                    </div>
                </div>
                <div class="input-group">
                    <button class="btn-block" @click="addPage">Add Page</button>
                </div>
            </div>
        </section>
    `,
    props:{
        params: Object
    },
    data(){
        return{
            title: 'New Page',
            name: '',
            primaryInfo: '',
            remark: '',

            errMsg_name: '',
            errMsg_password: ''
        }
    },
    watch:{
        name(){
            this.validateName()
        },
        primaryInfo(){
            this.validatePrimaryInfo()
        }
    },
    methods:{
        validateName(){
            if(this.name === '') {
                this.errMsg_name = 'name required'
                return false
            }
            // TODO: name 存在性检查
            else{
                this.errMsg_name = ''
                return true
            }
        },
        validatePrimaryInfo(){
            if(this.primaryInfo === '') {
                this.errMsg_password = 'password required'
                return false
            }
            else{
                this.errMsg_password = ''
                return true
            }
        },
        addPage(){
            var passed = true
            passed = this.validateName() && passed
            passed = this.validatePrimaryInfo() && passed
            if(passed){
                passwordBooks.addPage(this.params.passwordBookName, {
                    name: this.name,
                    primaryInfo: this.primaryInfo,
                    remark: this.remark
                })
                // alert('check passed, password name: ' + this.params.passwordBookName)
            }

        }
    },

    mounted(){
        console.log(this.params)
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

module.exports = newPage
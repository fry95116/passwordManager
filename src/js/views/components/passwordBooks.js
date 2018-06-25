var {passwordBooks} = require('../../models/passwordBooks')
var QRcodeReader = require('../QRcodeReader')

var passwordBooks_view = {
    name: 'passwordBooks',
    template:`
        <section id="passwordBooks" class="major-function" style="display:block;">

            <div class="title-bar">
                <h1 class="title-main">{{ title }}</h1>
            </div>
            <ul id="list-passwordBooks">
                <li v-for="name in passwordBookNames">
                    <h2 class="name">{{name}}</h2>
                    <div class="content" @click="decryptPasswordBook()">
                        <div class="overlap">
                            <div class="icon-bg">
                                <img class="icon" src="img/icon-locked.svg">
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </section>
    `,
    data(){
        return{
            title: 'PasswordBooks'
        }
    },

    computed:{
        passwordBookNames(){
            return passwordBooks.getPasswordBookNames()
        }
    },

    mounted(){
        this.$emit('setActionBar', {
            title: this.title,
            button_left:null,
            button_right: {
                text: 'Settings'
            }
        })
        this.$emit('setToolBar', null)
        
        this.$emit('setToolBar',[
            {
                icon: './img/newPasswordBook.svg',
                callback: ()=>{
                    this.$emit('route', 'newPasswordBook')
                }
            },
            {icon: './img/edit.svg'}
        ])
    },

    methods:{
        decryptPasswordBook(){
            QRcodeReader.readQRcode()
        }
    }
}

module.exports = passwordBooks_view
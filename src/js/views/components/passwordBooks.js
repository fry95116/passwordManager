var sha256 = require('sha256')

var { passwordBooks } = require('../../models/passwordBooks')
var privateKeyManager = require('../../models/privateKeyManager')
var QRcodeReader = require('../QRcodeReader')
var passwordBook = require('./passowordBook')

var passwordBooks_view = {
    name: 'passwordBooks',
    template: `
        <section id="passwordBooks" class="major-function" style="display:block;">

            <div class="title-bar">
                <h1 class="title-main">{{ title }}</h1>
            </div>
            <ul id="list-passwordBooks">
                <passwordBook 
                    v-for="name in passwordBookNames"
                    v-bind:key="name"
                    v-bind:name="name"
                    v-bind:privateKey="name === passwordBookName_decrypted ? privateKey : null"
                    @decrypt="decryptPasswordBook"
                ></passwordBook>
            </ul>
        </section>
    `,
    data() {
        return {
            title: 'PasswordBooks',
            privateKeyManager: privateKeyManager,

        }
    },

    computed: {
        passwordBookNames() {
            return passwordBooks.getPasswordBookNames()
        },
        passwordBookName_decrypted() {
            return privateKeyManager.name
        },
        privateKey() {
            return privateKeyManager.privateKey
        }
    },

    methods: {
        async decryptPasswordBook(name) {

            var privateKey = null
            try {
                privateKey = await QRcodeReader.readQRcode()
            }
            catch (err) {
                alert('Permission Denied')
                return
            }

            // 是否成功获取
            if (privateKey === null) {
                alert('fail to get privateKey')
                return
            }

            privateKeyManager.setPrivateKey(name, privateKey)

            this.$emit('setToolBar', [
                {
                    icon: './img/newPasswordBook.svg',
                    callback: () => {
                        this.$emit('route', 'newPage')
                    }
                },
                { icon: './img/edit.svg' },
                {
                    icon: './img/lock.svg',
                    callback: () => {
                        this.lock()
                    }
                }, // lock
            ])
        },

        lock() {
            privateKeyManager.clearPrivateKey()
            this.$emit('setToolBar', [
                {
                    icon: './img/newPasswordBook.svg',
                    callback: () => {
                        this.$emit('route', 'newPasswordBook')
                    }
                },
                { icon: './img/edit.svg' }
            ])
        }
    },

    mounted() {
        this.$emit('setActionBar', {
            title: this.title,
            button_left: null,
            button_right: {
                text: 'Settings'
            }
        })
        // this.$emit('setToolBar', null)

        this.$emit('setToolBar', [
            {
                icon: './img/newPasswordBook.svg',
                callback: () => {
                    this.$emit('route', 'newPasswordBook')
                }
            },
            { icon: './img/edit.svg' }
        ])
    },
    components: {
        passwordBook
    }
}

module.exports = passwordBooks_view
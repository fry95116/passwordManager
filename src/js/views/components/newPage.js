var {passwordBooks, PasswordBook} = require('../../models/passwordBooks')
var dropDown = require('./dropdown')
/* <input type="text" placeholder="RSA-1024">
<span class="caret"></span> */

var newPage = {
    name: 'newPage',
    template:`
        <section id="newPage" class="major-function">
            <div class="title-bar">
                <h1 class="title-main">{{ title }}</h1>
            </div>
        </section>
    `,
    data(){
        return{
            title: 'New Page'
        }
    },
    methods:{
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

module.exports = newPage
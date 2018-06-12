var newPasswordBook = {
    name: 'newPasswordBook',
    template:`
        <section id="newPasswordBook" class="major-function">
            <div class="title-bar">
                <h1 class="title-main">{{ title }}</h1>
            </div>
            <div class="input-group">
                <label>Name</label>
                <div class="input-wrapper">
                    <input type="text" placeholder="PasswordBook's name">
                </div>
            </div>
            <div class="input-group">
                <label>Encrypt Algorithm</label>
                <div class="input-wrapper">
                    <input type="text" placeholder="RSA-1024">
                </div>
            </div>
            <div class="input-group">
                <button class="btn-block">Generate Keygen</button>
            </div>
        </section>
    `,
    data(){
        return{
            title: 'Create'
        }
    },

    activated(){
        this.$emit('setTitle', this.title)
        this.$emit('setActionBar', {
            text: '< Back',
            callback: ()=>{
                this.$emit('route', 'passwordBooks')
            }
        })
        this.$emit('setToolBar', null)
    }
}

module.exports = newPasswordBook
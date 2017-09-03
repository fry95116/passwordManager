<template lang="pug">
  div.overview.container-fluid
    .toolbar.row.no-gutters.mt-3.mb-2
      .col-auto
        .dropdown
          button.btn.btn-outline-primary.dropdown-toggle.mr-2(
            type="button"
            data-toggle="dropdown"
          ) {{enum_sortBy[sortBy_Index].title}}
          .dropdown-menu
            a.dropdown-item(
              v-for="(item, index) in enum_sortBy"
              href="#"
              @click="sortBy_Index = index"
            ) 
              span {{item.title}}
              span.oi.oi-check.ml-2(v-if="index === sortBy_Index")
      .col
        input.form-control.search(type="text" placeholder="Search for...")
    .account-list.row
      .col
        .card.text-center(v-if="isNotDecrypted")
          .card-body.text-muted
            video#localVideo(
              autoplay
              muted
              playsinline
            )
            button.btn.btn-primary(
              type="button"
              @click="decrypt"
            ) 获取秘钥
            //- div.btn.btn-primary.my-file-input 拍下二维码以解锁
            //-   input(type="file" accept="image/*;capture=camera")
        .card.text-center(v-else-if="isEmpty")
          .card-body.text-muted 没有数据
        .list-group(v-else)
          router-link.list-group-item.list-group-item-action(
            v-for="account in accounts_sorted" 
            :key="account.name"
            :to="account.name"
            append
          )
            .container-fluid
              .row.no-gutters.justify-content-between
                .col-auto
                  h5.name.mr-2.mb-1 {{account.name}}
                .col
                  span.tag.mr-1(
                    v-for="tag in account.tags",
                    v-bind:style="{'background-color': enum_tags[tag].bgColor}"
                  )
                .col-auto
                  a(href="#" @click.prevent="remove(account.name)") Del
              //- .row.no-gutters.justify-content-left.mb-1.tags
              .row.no-gutters.justify-content-left.primaryInfo
                label.col-auto.mb-0.title {{account.primaryInfo.title}}
                .col
                  span.value {{account.primaryInfo.value}}
    router-link.btn.btn-primary.btn-float(
      tag="button"
      to="/accounts/newAccount"
      type="button"
      data-toggle="tooltip"
      data-placement="top"
      title="添加账户信息"
    )
      i.oi.oi-plus
</template>
<script>
  import Account from '../../store/Account'
  import Tags from '../../enums/Tags'
  import SortBy from '../../enums/SortBy'
  
  import _ from 'lodash'
  import {confirm} from '../../modalDialog'
  import TagPicker from '../../components/TagPicker.vue'

  export default {
    data(){
      return {
        enum_tags: Tags,
        sortBy_Index: 0,
        enum_sortBy: SortBy
      }
    },
    computed:{
      sortBy(){
        return this.enum_sortBy[this.sortBy_Index].field
      },
      accounts(){
        return this.$store.state.accounts.data
      },
      accounts_sorted(){
        return _.sortBy(this.accounts, el=>el[this.sortBy])
      },
      isNotDecrypted(){
        return this.$store.state.accounts.data === null
      },
      isEmpty(){
        return this.$store.state.accounts.data.length === 0
      }
    },

    methods:{
      decrypt(){
        // let duration = this.$store.state.configs.duration
        // this.$store.commit('accounts/unlock',{primaryKey: null})
        // setTimeout(()=>this.$store.commit('accounts/lock'), duration * 1000)
        let localVideo = document.getElementById('localVideo')
        navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true})
        .then(function(stream){
          localVideo.srcObject = stream
        })
        .catch(function(e) {
          alert('getUserMedia() error: ' + e);
        });
      },
      async remove(name){
        if(await confirm(`确认删除 ${name} ?`) === 'ok')
          this.$store.commit('accounts/remove', {name})
      }
    },
    
    components:{
      TagPicker
    }
  }
</script>
<style lang="scss" scoped>
.my-file-input{
  position: relative;

  input[type="file"]{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
  

.overview{
  .account-list{

    min-height: 480px;

    .list-group-item{
      .container-fluid{
        padding: 0;
        label{
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          color: #212529;

          &::after{
            content:'：'
          }
        }
      }
    }
  }
}
</style>

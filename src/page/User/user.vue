<template>
  <div class="layout-container">
    <y-header>
      <div slot="nav"></div>
    </y-header>
    <div class="w">
      <div class="content">
        <div class="account-sidebar">
          <div class="avatar gray-box ">
            <div>
              <div>
                <!--<img :src="userInfo.file">-->
              </div>
              <!--<h5>{{userInfo.username}}</h5>-->
            </div>
            <div class="box-inner">
              <ul class="account-nav">
                <li v-for="(item,i) in nav" :key='i'>
                  <router-link :to="{name: item.name}" v-text="item.cname"></router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="account-content">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </div>
    <y-footer></y-footer>
  </div>
</template>
<script>
  import YFooter from '/common/footer'
  import YHeader from '/common/header'
  import { mapState } from 'vuex'
  export default {
    data () {
      return {
        title: '收货地址',
        nav: [
          {name: 'AddressList', cname: '收货地址'},
          {name: 'Coupon', cname: '我的优惠'},
          {name: 'Support', cname: '售后服务'},
          {name: 'Aihuishou', cname: '以旧换新'}
        ],
        editAvatar: true
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    mounted () {
    },
    components: {
      YFooter,
      YHeader
    }
  }
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../../assets/style/mixin";

  .w {
    padding-top: 40px;
  }
  .router-link-active{
    position: relative;
    z-index: 1;
    height: 50px;
    background-color: #98AFEE;
    line-height: 50px;
    color: #FFF;
  }
  .content {
    display: flex;
    height: 100%;
  }

  .account-sidebar {
    width: 210px;
    border-radius: 6px;
    .avatar {
      padding-top: 20px;
      border-radius: 10px;
      text-align: center;
      img {
        width: 168px;
        height: 168px;
      }
      h5 {
        font-size: 18px;
        line-height: 48px;
        font-weight: 700;
      }
    }
    .account-nav {
      padding-top: 15px;
      li {
        position: relative;
        height: 48px;
        border-top: 1px solid #EBEBEB;
        line-height: 48px;
        &:hover {
          a {
            position: relative;
            z-index: 1;
            height: 50px;
            background-color: #98AFEE;
            line-height: 50px;
            color: #FFF;
          }

        }
        a {
          display: block;
        }

      }
    }
  }

  .account-content {
    margin-left: 20px;
    flex: 1;
  }


</style>

<template>
  <div class="header-box">
    <div>
      <header class="w">
        <div class="w-box">
          <div class="nav-logo">
            <h1>
              <router-link to="/"></router-link>
            </h1>
          </div>
          <!-- 搜索框 -->
          <div class="right-box">
            <div class="nav-list">
              <!--
                自动完成搜索
                1. icon设置搜索图标
                2. fetch-suggestions设置搜索建议
                4. on-icon-click 点击icon触发
                5. @keydown 按下回车键触发
               -->
              <el-input
                placeholder="请输入商品信息"
                icon="search"
                v-model="input"
                :on-icon-click="handleIconClick"
                @keydown.enter.native="handleIconClick">
              </el-input>
              <router-link :to="{name: 'Goods', params: {cid: 1}}">全部商品</router-link>
            </div>
            <!-- 个人页面链接 -->
            <div class="nav-aside" ref="aside">
              <div class="user pr">
                <router-link :to="{name: 'AddressList'}"></router-link>
              </div>
            </div>
          </div>
        </div>
      </header>
      <!-- 导航链接 -->
      <slot name="nav">
        <div class="nav-sub">
          <div class="nav-sub-bg"></div>
          <div class="nav-sub-wrapper">
            <div class="w">
              <ul class="nav-list2">
                <li>
                  <router-link :to="{name: 'index'}">首页</router-link>
                </li>
                <li>
                  <router-link :to="{name: 'Goods', params: {cid: 1}}">全部商品</router-link>
                </li>
                <li>
                  <router-link :to="{name: 'Goods', params: {cid: 1184}}">品牌周边</router-link>
                </li>
                <li>
                  <a href="https://github.com/erwin0929/xmall/tree/dev" target="_blank">Github</a>
                </li>
              </ul>
              <div></div>
            </div>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
  import { getStore } from '/utils/storage'
  import 'element-ui/lib/theme-default/index.css'
  export default{
    data () {
      return {
        user: {},
        // 查询数据库的商品
        st: false,
        positionL: 0,
        positionT: 0,
        input: '',
        choosePage: 1,
        searchResults: [],
        timeout: null,
        token: ''
      }
    },
    methods: {
      // 点击搜索icon,或回车跳转至搜索页,query为用户输入的关键字
      handleIconClick () {
        this.$router.push({
          name: 'Search',
          query: {
            key: this.input
          }
        })
      }
    },
    mounted () {
      this.token = getStore('token')
      if (typeof (this.$route.query.key) !== undefined) {
        this.input = this.$route.query.key
      }
    }
  }
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../assets/style/theme";
  @import "../assets/style/mixin";
  $img-path: '../assets/images/';
  .router-link-active{
    font-weight: bold;
  }
  .header-box {
    background: $head-bgc;
    background-image: -webkit-linear-gradient(#000, #121212);
    background-image: linear-gradient(#000, #121212);
    width: 100%;
  }
  header {
    height: 100px;
    z-index: 30;
    position: relative;
  }
  .w-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    // position: relative;
    h1 {
      height: 100%;
      display: flex;
      align-items: center;
      > a {
        background: url(#{$img-path}global-logo-red@2x.png) no-repeat 50%;
        background-size: cover;
        display: block;
        @include wh(50px, 40px);
        text-indent: -9999px;
        background-position: 0 0;
      }
    }
    .nav-list {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 22px;
      .el-autocomplete{
        width: 20vw;
      }
      a {
        width: 140px;
        color: #c8c8c8;
        display: block;
        font-size: 14px;
        padding: 0 25px;
        &:hover {
          color: #fff;
        }
      }
      a:nth-child(2){
        margin-left: -10px;
      }
    }
    .nav-aside {
      position: relative;
      &:before {
        background: #333;
        background: hsla(0, 0%, 100%, .2);
        content: " ";
        @include wh(1px, 13px);
        overflow: hidden;
        // position: absolute;
        display: flex;
        align-items: center;
        // top: 4px;
        left: 0;
      }
    }
    .right-box {
      display: flex;
    }
    .nav-aside {
      display: flex;
      align-items: center;
    }
    // 用户
    .user {
      margin-left: 41px;
      width: 36px;
      &:hover {
        a:before {
          background-position: -5px 0;
        }
        .nav-user-wrapper {
          top: 18px;
          visibility: visible;
          opacity: 1;
          -webkit-transition: opacity .15s ease-out;
          transition: opacity .15s ease-out;
        }
      }
      > a {
        position: relative;
        @include wh(36px, 20px);
        display: block;
        text-indent: -9999px;
        &:before {
          content: " ";
          position: absolute;
          left: 8px;
          top: 0;
          @include wh(20px);
          background: url(#{$img-path}account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png) -155px 0;
          background-size: 240px 107px;
          transition: none;
        }
      }
      li + li {
        text-align: center;
        position: relative;
        border-top: 1px solid #f5f5f5;
        line-height: 44px;
        height: 44px;
        color: #616161;
        font-size: 12px;
        &:hover {
          background: #fafafa;
        }
        a {
          display: block;
          color: #616161;
        }
      }
    }
  }
  .nav-sub {
    position: relative;
    z-index: 20;
    height: 90px;
    background: #f7f7f7;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .04);
    .nav-sub-wrapper {
      padding: 31px 0;
      height: 90px;
      position: relative;
      &:after {
        content: " ";
        position: absolute;
        top: 89px;
        left: 50%;
        margin-left: -610px;
        width: 1220px;
        background: #000;
        height: 1px;
        display: none;
        opacity: 0;
        -webkit-transition: opacity .3s ease-in;
        transition: opacity .3s ease-in;
      }
    }
    .w {
      display: flex;
      justify-content: space-between;
    }
    .nav-list2 {
      height: 28px;
      line-height: 28px;
      display: flex;
      align-items: center;
      height: 100%;
      li:first-child {
        padding-left: 0;
        a {
          padding-left: 10px;
        }
      }
      li {
        position: relative;
        float: left;
        padding-left: 2px;
        a {
          display: block;
          padding: 0 10px;
          color: #666;
          &.active {
            font-weight: bold;
          }
        }
        a:hover {
          color: #5683EA;
        }
      }
      li:before {
        content: ' ';
        position: absolute;
        left: 0;
        top: 13px;
        width: 2px;
        height: 2px;
        background: #bdbdbd;
      }
    }
  }
</style>


<!-- index.vue -->
<template>
  <div>
    <y-header></y-header>
    <!-- 顶级路由出口,使用了动画过渡 -->
    <transition name="fade" mode="out-in">
      <router-view class="main"></router-view>
    </transition>
    <y-footer></y-footer>
  </div>
</template>
<script>
  import YHeader from '/common/header'
  import YFooter from '/common/footer'
  export default {
    components: {
      YHeader,
      YFooter
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/style/mixin";
  .main {
    min-height: calc(100vh - 454px);
    background: #ededed;
    overflow: hidden;
    width: 100%;
  }
  .bn {
    border-style: none;
    border-width: 0;
    border: none;
  }
  .move_img {
    position: fixed;
    @include wh(40px);
    width: 45px;
    z-index: 29;
    height: 45px;
    div {
      @extend .bn;
    }
    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      display: block;
      @extend .bn;
    }
  }
</style>

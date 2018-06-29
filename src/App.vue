<template>
  <div id="app">
    <router-view class="main"></router-view>
  </div>
</template>
<script>
  export default {
    name: 'app'
  }
</script>
<style lang="scss" type="text/scss">
  @import "assets/style/index.scss";
  #app {
    height: 100%;
  }
  .main {
    background: #ededed;;
  }
  .fade-enter-active,
  .fade-leave-active{
    transition: opacity .5s;
  }
  .fade-enter,
  .fade-leave-to{
    opacity: 0;
  }
  $np-color: #d8328c;
  #nprogress{
    .bar{
      background: $np-color !important;
      height: 8px !important;
    }
    .spinner-icon{
      border-top-color: $np-color !important;
      border-left-color: $np-color !important;
    }
  }
</style>

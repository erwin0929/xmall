<template>
  <div class="footer">
    <div class="container">
      <div class="siteinfo">
        <ul class="c0">
          <h3 class="c1">购物指南</h3>
          <ul>
            <li class="c2"><a class="c3">购物流程</a></li>
            <li class="c2"><a class="c3">会员介绍</a></li>
            <li class="c2"><a class="c3">生活旅行</a></li>
          </ul>
        </ul>
        <ul class="c0">
          <h3 class="c1">配送方式</h3>
          <ul>
            <li class="c2"><a class="c3">上门自提</a></li>
            <li class="c2"><a class="c3">配送查询</a></li>
            <li class="c2"><a class="c3">海外配送</a></li>
          </ul>
        </ul>
        <ul class="c0">
          <h3 class="c1">支付方式</h3>
          <ul>
            <li class="c2"><a class="c3" target="_blank">货到付款</a></li>
            <li class="c2"><a class="c3" target="_blank">在线支付</a></li>
            <li class="c2"><a class="c3" target="_blank">分期付款</a></li>
          </ul>
        </ul>
        <ul class="c0">
          <h3 class="c1">售后服务</h3>
          <ul>
            <li class="c2"><a class="c3" target="_blank" href="http://xpay.exrick.cn">xxx</a></li>
            <li class="c2"><a class="c3" target="_blank" href="http://shouji.baidu.com/software/11783429.html">xxx</a></li>
            <li class="c2"><a class="c3" target="_blank" href="https://github.com/Exrick">xxx</a></li>
          </ul>
        </ul>
        <ul class="c0">
          <h3 class="c1">友情链接</h3>
          <ul>
            <li class="c2"><a class="c3">xxx</a></li>
            <li class="c2"><a class="c3">xxx</a></li>
            <li class="c2"><a class="c3">xxx</a></li>
          </ul>
        </ul>
        <ul class="c0">
          <h3 class="c1">关注我吧</h3>
          <ul>
            <li class="c2"><a class="c3" target="_blank">腾讯 QQ</a></li>
            <li class="c2"><a class="c3" target="_blank">新浪微博</a></li>
            <li class="c2"><a class="c3" target="_blank">官方邮箱</a></li>
          </ul>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
  .footer {
    padding: 50px 0 20px;
    border-top: 1px solid #e6e6e6;
    background: #fafafa;
    margin-top: 60px;
    height: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .container {
    width: 1220px;
  }
  .siteinfo {
    height: 100px;
    padding: 50px 0 130px;
    border-bottom: 1px solid #e6e6e6;
    position: relative;
    display: flex;
    justify-content: center;
  }
  .c0 {
    width: 149px;
    line-height: 1;
    float: left;
  }
  .c1 {
    color: #646464;
    font-size: 12px;
    padding: 0 0 14px;
  }
  .c2 {
    color: #c3c3c3;
    font-size: 12px;
    padding: 6px 0;
  }
  .c3 {
    color: #969696;
  }
</style>

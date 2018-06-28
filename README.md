## xmall商城

> 目录结构

```
├── README.md
├── build
├── config
├── index.html
├── package.json 
├── src
│   ├── App.vue 入口模板文件
│   ├── assets  静态资源,字体和scss
│   ├── common 公用的头部和尾部
│   ├── components 公用组件
│   ├── main.js 入口文件
│   ├── mock 随机数据生成,模拟接口的文件
│   ├── page 各页面
│   ├── router 路由目录
│   ├── store vuex状态管理目录
│   └── utils 操作localstoge的方法
└── static
    ├── images 图片
    └── svg svg图片
```        

> 技术栈
* Webpack
* Vue
* Vuex
* Vue-Router
* Mock
* Axios
* Es6
* Sass
* ElementUi
* axios-mock-adapter (接受前端发出的请求和参数,模拟后端接口返回)

> 该项目使用eslint

> main.js 入口文件

```
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
// 图片懒加载
import VueLazyload from 'vue-lazyload'
import VueCookie from 'vue-cookie'
import axios from 'axios'
import data from './mock/index'
// 按需加载Elementui组件
import { Button, FormItem, Form, Pagination, Checkbox, Icon, Autocomplete, Loading, Message, Notification, Steps, Step, Table, TableColumn, Input, InputNumber, Dialog, Select, Option, Carousel, CarouselItem } from 'element-ui'
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Checkbox)
Vue.use(Icon)
Vue.use(Autocomplete)
Vue.use(Steps)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Step)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(CarouselItem)
Vue.use(Carousel)
Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.use(VueCookie)
Vue.use(VueLazyload, {
  loading: '/static/images/load.gif'
})
Vue.config.productionTip = false
// 定义全局前置守卫
// 不需要登陆的页面
const whiteList = ['home', 'goods', 'login', 'register', 'goodsDetails', 'search', 'refreshsearch']
router.beforeEach(function (to, from, next) {
  // 获取localStorage中的userId
  let userId = localStorage.getItem('userId')
  // 防止用户手动删除userId
  if (userId) {
    data.getData()
    // 每次路由跳转都要读到该用户存于localstorge和vm.userInfo中
    axios.post('/member/getUserById', {userId})
      .then((response) => {
        let { data } = response
        if (data) {
          store.commit({
            type: 'RECORD_USERINFO',
            data
          })
        }
      })
  }
  let path = to.path.split('/')[1]
  // whiteList中的页面无需登录,若进入隐私页面,且没有token(未登录)则强制跳转到登录页
  whiteList.indexOf(path) === -1 && userId === null ? next({name: 'login'}) : next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

```

* 性能起见,按需引入了ElementUi的组件。
* 引入了vueLazyLoad,并配置了默认显示图片。
* 定义全局导航守卫:
    1. 定义白名单,这些白名单页面无需登录也可访问,根据token来判断是否登录,如果游客访问白名单以外的页面强制push到登录页。
    2. 每次路由跳转都请求后端该用户的信息,此时唤醒一个mutations,将这些数据存入store的state中,以便后期的访问。
    3. 弊端,每次跳转都请求,过于浪费性能,应该使用localstorge来缓存数据,有优化空间。
* 最后实例化Vue,将导入的选项注入,开启页面。    

> App.vue 入口模板文件

```
<template>
  <div id="app">
    <router-view class="main"></router-view>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
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
</style>

```

* 定义顶级路由出口,所有页面都由此而出。
* 将Vue实例挂载到该div#app上。
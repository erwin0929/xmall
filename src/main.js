import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
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
  // loading: `./assets/images/load.gif`
  // 这里写的是编译后的路径
  loading: `./static/images/load.gif`
})
Vue.config.productionTip = false
// 定义全局前置守卫
// 不需要登陆的页面,开放页
const whiteList = ['home', 'goods', 'login', 'register', 'goodsDetails', 'search']
router.beforeEach(function (to, from, next) {
  // 设置标题
  document.title = to.meta.title
  let userId = localStorage.getItem('userId')
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

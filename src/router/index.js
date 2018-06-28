import Vue from 'vue'
import Router from 'vue-router'
const Index = () => import('/page/index.vue')
const Login = () => import('/page/Login/login.vue')
const Register = () => import('/page/Login/register.vue')
const Home = () => import('../page/Home/home.vue')
const GoodS = () => import('/page/Goods/goods.vue')
const goodsDetails = () => import('/page/Goods/goodsDetails.vue')
const user = () => import('/page/User/user.vue')
const addressList = () => import('/page/User/children/addressList.vue')
const coupon = () => import('/page/User/children/coupon.vue')
const support = () => import('/page/User/children/support.vue')
const checkout = () => import('/page/Checkout/checkout.vue')
const Search = () => import('/page/Search/search.vue')
const Aihuishou = () => import('/page/User/children/aihuishou.vue')
Vue.use(Router)
export default new Router({
  routes: [
    {
      // 商品列表页,开放访问
      path: '/',
      component: Index,
      name: 'index',
      redirect: '/home',
      children: [
        {path: 'home', component: Home},
        // 商品列表
        {path: 'goods/:cid', component: GoodS, name: 'Goods', meta: {title: '商品列表'}},
        // 商品详细页
        {path: 'goodsDetails', name: 'goodsDetails', component: goodsDetails, meta: {title: '商品详情'}}
      ]
    },
    // 登录注册
    {path: '/login', name: 'login', component: Login, meta: {title: '登录'}},
    {path: '/register', name: 'register', component: Register, meta: {title: '注册'}},
    {
      path: '/order',
      name: 'order',
      component: () => import('../page/Order/order'),
      // 搜索页
      children: [
        {path: '/search', name: 'Search', component: Search, meta: {title: '搜索'}}
      ]
    },
    // 个人页面,登录才有
    {
      path: '/user',
      name: 'user',
      component: user,
      children: [
        // 收货地址
        {path: 'addressList', name: 'AddressList', component: addressList, meta: {title: '收货地址'}},
        // 优惠券
        {path: 'coupon', name: 'Coupon', component: coupon, meta: {title: '优惠券'}},
        // 售后服务
        {path: 'support', name: 'Support', component: support, meta: {title: '售后服务'}},
        // 以旧换新
        {path: 'aihuishou', name: 'Aihuishou', component: Aihuishou, meta: {title: '以旧换新'}}
      ]
    },
    // 提交订单页,未完成!
    {path: '/checkout', name: 'Checkout', component: checkout, meta: {title: '提交订单'}},
    {path: '*', redirect: '/home'}
  ]
})

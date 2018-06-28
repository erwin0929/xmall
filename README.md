## xmall商城解析,不完全攻略

> 目录结构

```
├── README.md
├── build
├── config
├── index.html
├── package.json 
├── src
│   ├── App.vue 入口模板文件
│   ├── assets  静态资源,字体和scss
│   ├── common 公用的头部和尾部
│   ├── components 公用组件
│   ├── main.js 入口文件
│   ├── mock 随机数据生成,模拟接口的文件
│   ├── page 各页面
│   ├── router 路由目录
│   ├── store vuex状态管理目录
│   └── utils 操作localstoge的方法
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

> 为保证代码质量,该项目使用了eslint的standard规则,总结的代码规范如下

* 禁止任何无意义的空行
* 代码末尾使用分号
* 字符串禁止使用双引号
* 逗号后面必须留有一个空格
* 函数名与括号之间必须留有空格,括号和大括号之间必须留有空格
* 定义的变量必须使用
* 禁止使用未定义的变量
* 同一作用域下禁止重复定义变量
* 制表符为2个空格的长度
* 诸多规则,不详解

> main.js 入口文件 (节选)

```
// 图片懒加载
import VueLazyload from 'vue-lazyload'
// 按需加载Elementui组件
import { ButtonInputNumber, Dialog, Select, Option, Carousel, CarouselItem }from 'element-ui'
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
  // 设置标题
  document.title = from.meta.title
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

* 性能起见,按需引入了ElementUi的组件。
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

> 路由配置 router/index.js (节选)

```
import Vue from 'vue'
import Router from 'vue-router'
const Index = () => import('/page/index.vue')
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

```

* 这里定义了页面的路由记录,为了提升性能,其中使用了`import()`按需加载,而非一次性加载。
* 为每个路由命名
* `{path: 'goods/:cid', component: GoodS, name: 'Goods', meta: {title: '商品列表'}}` 为商品列表使用动态路由  
根据cid获取不同数据。定义了路由元信息meta,为了更改每个页面的标题,最后一行将所有未匹配到的1级路径全部重定向至`/home`路径。
* 定义了诸多嵌套路由。

> store(vuex)


> store/index.js
```
*** index.js
// 定义根action,state,mutations
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import action from './action'
Vue.use(Vuex)

const state = {
  login: false,   // 是否登录
  userInfo: null // 用户信息
}

// 将配置注入
export default new Vuex.Store({
  state,
  action,
  mutations
})

*** mutation-type.js
// 定义mutations
export const GET_USERINFO = 'GET_USERINFO'
export const RECORD_USERINFO = 'RECORD_USERINFO'


*** mutations.js
import {
  GET_USERINFO,
  RECORD_USERINFO
} from './mutation-types'
import { setStore } from '../utils/storage'
export default {
  // 记录用户信息
  [RECORD_USERINFO] (state, payLoad) {
    let {data: info} = payLoad
    // 将用户信息存入state.userInfo方便读取
    state.userInfo = info
    // 保存了是否登录
    state.login = true
    // 将用户信息存入localstorge
    setStore('userInfo', info)
  },
  // 获取用户信息,通过store.commit触发该方法,并接受载荷
  [GET_USERINFO] (state, info) {
    if (state.userInfo && (state.userInfo.username !== info.username)) {
      return
    }
    if (!state.login) {
      return
    }
    if (!info.message) {
      state.userInfo = {...info}
    } else {
      state.userInfo = null
    }
  }
}


```
* 


> assets目录
* icon 字体文件
* images 测试图片
* scss文件
    1. common.scss 通用样式,常用样式
    2. index.scss 调用了reset.scss和common.scss
    3. mixin.scss 定义了函数,使样式更具定制化
    4. reset.scss 重置浏览器默认样式,解决兼容性问题
    5. theme.scss 主题文件,存放了颜色

> common目录

header.vue 节选
```
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
```

* 该组件使用了搜索功能, 页面加载完后从url中的查询字段key中获取查询的关键字,将该关键字放入对应input中,  
并且跳转至搜索页,搜索页会做一系列查询操作。
* 这里的slot是为了在搜索页不显示导航链接。


> compoonents

mallGoods.vue

```
<!-- 列表循环组件 -->
<template>
  <div class="good-item">
    <div style="">
      <div class="good-img">
        <!-- 根据productId,点击进入详情页,以查询参数判断是哪个商品 -->
        <router-link :to="{name: 'goodsDetails', query: {productId: msg.productId}}">
          <!-- 图片懒加载 -->
          <img v-lazy="msg.productImageBig" :alt="msg.productName">
        </router-link>
      </div>
      <!-- 产品名 -->
      <h6 class="good-title" v-html="msg.productName"></h6>
      <!-- 产品描述 -->
      <h3 class="sub-title ellipsis">{{msg.subTitle}}</h3>
      <div class="good-price pr">
        <div class="ds pa">
          <!-- 点击查看详情,根据productId判断是哪个商品 -->
          <router-link :to="{name: 'goodsDetails', query: {productId: msg.productId}}">
            <el-button type="primary" size="small">查看详情</el-button>
          </router-link>
        </div>
        <!-- 将价格转换为数值后取2位浮点数 -->
        <p><span style="font-size:14px">￥</span>{{Number(msg.salePrice).toFixed(2)}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      msg: {
        salePrice: 0,
        productName: ''
      }
    }
  }
</script>
```

* 列表循环组件,由父级传递数据,通过prop中的msg传递过来,在对应地方读取,有注释,不详解。


> YButton.vue

```
<template>
  <input :type="inputType"
         readonly
         :class="classStyle"
         @click="btnClick($event)"
         :disabled="classStyle==='disabled-btn'"
         :value="text">
</template>
<script>
  export default {
    props: {
      text: {
        type: [String, Number],
        default: '一颗小按钮'
      },
      inputType: {
        type: [String],
        default: 'button'
      },
      classStyle: {
        type: String,
        default: 'default-btn'
      }
    },
    methods: {
      btnClick (event) {
        this.$emit('btnClick', event)
      }
    }
  }
</script>
```

* 按钮组件,可定制。
* 根据父组件传递的props来定制按钮
* text: 按钮文本,类型必须是String或Number,默认为一颗小按钮
* inputType: 按钮类型,必须是String类型,默认为button类型
* classStyle: 设置样式,类型必须是String,默认为default-btn
* 定义一个向父级通讯的方法btnClick,当点击该按钮触发该方法,此方法使用$emit找寻父级的btnClick自定义事件,同时将event传给父级

> mock

```
import Mock from 'mockjs'

// 商品数据
export const Goods = Mock.mock({
  'list|333': [
    {
      'productId|+1': 1,
      // 产品名
      'productName|1': [
        'FIIL Driifter 脖挂蓝牙耳机',
        '优点智能 E1 推拉式智能指纹密码锁',
        'ACIL E1 颈挂式蓝牙耳机',
        'Smartisan 明信片',
        'Smartisan 牛津纺衬衫',
        `Smartisan T恤 任天堂发售“红白机”`,
        'Smartisan 帆布鞋”',
        '坚果 3 "足迹"背贴 乐高创始人出生”'
      ],
      // 展示图3张,可切换
      'small': [
        `@dataImage(400x400,这是预览图1)`,
        `@dataImage(400x400,这是预览图2)`,
        `@dataImage(400x400,这是预览图3)`
      ],
      // 产品标题
      'subTitle': '@name',
      // 售价
      'salePrice|10-19999.2': 1,
      // 列表图
      'productImageBig': `@dataImage(250x250,这是测试图片)`,
      // 库存
      'limitNum|1-5': 1,
      // banner图
      'banner': `@dataImage(1200x500,这是测试图片)`
    }
  ]
})

// 品牌周边
export const BrandSide = Mock.mock({
  'list|8': [
    {
      'productId|+1': 1,
      // 产品名
      'productName|1': [
        'FIIL Driifter 脖挂蓝牙耳机',
        'Smartisan 帆布鞋”',
        'Ipad',
        'Mac book',
        'HuaWei',
        'Nuojiya',
        '网球拍'
      ],
      // 展示图3张,可切换
      'small': [
        `@dataImage(400x400,这是预览图1)`,
        `@dataImage(400x400,这是预览图2)`,
        `@dataImage(400x400,这是预览图3)`
      ],
      // 产品标题
      'subTitle': '@name',
      // 售价
      'salePrice|10-19999.2': 1,
      // 列表图
      'productImageBig': `@dataImage(250x250,这是测试图片)`,
      // 库存
      'limitNum|1-5': 1
    }
  ]
})

```

这里列举一个mock生成的随机数据,生成之后导出这些数据,以便写接口时使用,mock写法不做解释了,官方Api非常齐全。

> mock/index.js

```
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Goods, BrandSide } from './data/goods'
import { RegisterUser } from './data/register'

// 开启请求延迟
const MockAda = new MockAdapter(axios, { delayResponse: 300 })

// 导出该函数,并在导入处执行。即可模拟后端返回
export default {
  getData () {
    // 返回全部商品
    MockAda.onPost('/goods/allGoods').reply(config => {
      // 将参数格式化获取到重要分页参数
      let { page, size: pageSize, sort, priceGt: min, priceLte: max, cid, key } = JSON.parse(config.data)
      let list = []
      // 判断是否是周边品牌。深拷贝数据,以防止破坏数据源
      if (cid === 1184) {
        list = BrandSide.list.slice(0)
      } else {
        list = Goods.list.slice(0)
      }
      // 1: 0, 5;  2: 5,5, ; 3: 10 5
      // 根据规律计算出截取值index,以及截取数量就是每页显示的数量pageSize
      let index = (page - 1) * pageSize
      if (key) {
        // 关键字查询
        list = list.filter(item => {
          if (item.productName.indexOf(key) > -1) {
            item.productName = item.productName.replace(key, `<i style="color: #e4393c">${key}</i>`)
            return true
          }
        })
      }
      // 价格筛选
      list = list.filter(item => {
        if (min !== '' && max !== '') {
          if (item.salePrice > min && item.salePrice < max) {
            return true
          }
        } else {
          return true
        }
      })
      // 获取数据总条数
      let total = list.length
      // 根据参数截取指定的数据最后返回
      list = list.splice(index, pageSize)
      // 排序
      list = list.sort((a, b) => {
        if (sort === '') {
          return
        }
        return sort === 1 ? a.salePrice - b.salePrice : b.salePrice - a.salePrice
      })
      return [
        200,
        { total, list }
      ]
    })
    // 根据id获取数据
    MockAda.onPost('/goods/productDet').reply(config => {
      let { productId } = JSON.parse(config.data)
      let list = Goods.list.slice(0)
      // 判断id值相等的数据并返回
      list = list.filter(item => +item.productId === +productId)
      return [
        200,
        { list }
      ]
    })
    // banner推荐轮播图
    MockAda.onPost('/goods/home').reply((config) => {
      let list = Goods.list.slice(0)
      let banner = list.splice(3, 5)
      let hot = list.splice(13, 2)
      let guanfang = list.splice(23, 8)
      let choose = list.splice(33, 7)
      return [
        200,
        { list: banner, hot, guanfang, choose }
      ]
    })
    MockAda.onPost('/member/register').reply((config) => {
      let { userName: username, userPwd: pwd } = JSON.parse(config.data)
      let id = RegisterUser.length + 1
      RegisterUser.push({
        id,
        username,
        pwd
      })
      return [
        200,
        { code: 200, msg: '注册成功' }
      ]
    })
    // 登录接口,判断账号密码是否与库中的匹配
    MockAda.onPost('/member/checkLogin').reply((config) => {
      let { userName: username, userPwd: pwd } = JSON.parse(config.data)
      let registerUser = RegisterUser.slice(0)
      let aUser = registerUser.filter(item => item.username === username && item.pwd === pwd)
      return [
        200,
        aUser[0]
      ]
    })
    // 根据id返回某个用户
    MockAda.onPost('/member/getUserById').reply((config) => {
      let { userId } = JSON.parse(config.data)
      let registerUser = RegisterUser.slice(0)
      let aUser = registerUser.filter(item => item.id === +userId)
      return [
        200,
        aUser[0]
      ]
    })
    // 删除收货地址
    MockAda.onPost('/deleteAddress').reply((config) => {
      let { index } = JSON.parse(config.data)
      let registerUser = RegisterUser.slice(0)
      registerUser[0].address.splice(index, 1)
      return [
        200,
        {isDelete: true}
      ]
    })
    // 新增收货地址
    MockAda.onPost('/addAdress').reply((config) => {
      let { addForm } = JSON.parse(config.data)
      let registerUser = RegisterUser.slice(0)[0]
      let addressId = registerUser.address.length + 1
      addForm.addressId = addressId
      registerUser.address.push(addForm)
      return [
        200,
        {add: true}
      ]
    })
  }
}
```

* 这里是我的后端接口,根据前端传递的参数,返回对应的数据。
* 这里我们列举第一个接口来说明,该接口是根据条件返回商品数据  
`let { page, size: pageSize, sort, priceGt: min, priceLte: max, cid, key } = JSON.parse(config.data)`  
这些是可能接收到的参数,由于这些参数是字符串,要使用`JSON.parse`转换成对象类型。
* 分页: 1: 0, 5;  2: 5,5, ; 3: 10 5  
根据上述规律计算出截取值index,以及截取数量就是每页显示的数量pageSize  
所以得出公式`index = (page - 1) * pageSize`,  
list = list.splice(index, pageSize),使用splice方法截取数据,即可完成分页
* 关键字查询
    ```
    // 使用filter方法来遍历数据中是否有需要的数据
    list = list.filter(item => {
        // 判断数据中是否有用户输入的关键字,有则将该文本替换成红色,再返回
        if (item.productName.indexOf(key) > -1) {
            item.productName = item.productName.replace(key, `<i style="color: #e4393c">${key}</i>`)
            return true
        }
    })
    ```
* 价格筛选
    ```
    // 判断是否有价格在某个区间
    list = list.filter(item => {
        // min 为最小值,max为最大值,如果存在该数字,则保留下该数据,继续向后查询
        if (min !== '' && max !== '') {
            if (item.salePrice > min && item.salePrice < max) {
            return true
            }
        } else {
            return true
        }
    })
    ```
* 根据价格排序
```
// 排序 sort可能的值:为空则默认排序,sort=1 则由低到高排序,sort=2则由高到低排序
list = list.sort((a, b) => {
if (sort === '') {
    return
}
// 根据sort值来判断如何排序,通过Array.prototype.sort方法来排序数组
return sort === 1 ? a.salePrice - b.salePrice : b.salePrice - a.salePrice
})

```
* 过滤完毕后,通过return返回,状态码为200,total为总条数,list为具体数据  
```
return [
    200,
    { total, list }
]
```

这里列举一个接口做说明,后面的接口有注释,不做解释了。  
虽然实际项目中不会由前端人员来开发后端接口,但是这些代码对于我来说都是宝贵的体验,通过一些列算法来获得最终需要的数据,可以增进对js函数对js的理解,对算法的理解,这是我所想要的。


> page目录存放了各页面

> index.vue 入口页

```
<!-- index.vue -->
<template>
  <div>
    <y-header></y-header>
    <!-- 顶级路由出口,使用了动画过渡,模式为先渲染,后过渡 -->
    <transition name="fade" mode="out-in">
      <router-view class="main"></router-view>
    </transition>
    <y-footer></y-footer>
  </div>
</template>
```

> Home/home.vue 首页

```
<template>
  <div class="home">
    <div v-loading="loading" element-loading-text="加载中..." v-if="!error">
      <!-- banner -->
      <div class="banner" >
      <!-- 幻灯片 interval:设置切换时间为5秒,autoplay设置自动播放,arrow设置箭头是否显示,height设置高度  -->
        <el-carousel :interval="5000" :autoplay="true" arrow="always" height="500">
        <!-- 根据banner循环,key为productId -->
          <el-carousel-item v-for="item in banner" :key="item.productId">
          <!-- 设置链接,跳转至商品详细页,参数为productId -->
            <router-link :to="{name: 'goodsDetails', query: {productId: item.productId}}">
            <!-- 图片 -->
              <img class="img1" :src="item.banner">
            </router-link>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- 四连坐 根据choose循环,同样设置链接,参数为productId -->
      <div class="activity-panel">
        <ul class="box">
          <li class="content" v-for="item in choose" :key="item.productId" >
            <router-link :to="{name: 'goodsDetails', query: {productId: item.productId}}">
              <img class="i" :src="item.productImageBig">
            </router-link>
          </li>
        </ul>
      </div>
      <!-- 热门商品 根据hot循环 -->
      <section class="w mt30 clearfix">
        <y-shelf title="热门商品">
          <div slot="content" class="hot">
            <mall-goods :msg="item" v-for="item in hot" :key="item.productId"></mall-goods>
          </div>
        </y-shelf>
      </section>
      <!-- 官方精选 根据guanfang循环,使用slot插槽替换组件中name="content"元素 -->
      <section class="w mt30 clearfix">
        <y-shelf title="官方精选">
          <div slot="content" class="floors" >
            <mall-goods :msg="item" v-for="item in guanfang" :key="item.productId"></mall-goods>
          </div>
        </y-shelf>
      </section>
    </div>
    <!-- 如果没有数据则显示该元素 -->
    <div class="no-info" v-if="error">
      <div class="no-data">
        <img src="/static/images/error.png">
        <br> 抱歉！出错了...
      </div>
    </div>
    <!-- 欢迎弹窗 -->
    <el-dialog
      title="通知"
      :visible.sync="dialogVisible"
      width="30%"
      style="width:70%;margin:0 auto">
      <span>欢迎光临本页</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios'
  import data from '../../mock/index'
  import YShelf from '/components/shelf'
  import mallGoods from '/components/mallGoods'
  export default {
    data () {
      return {
        error: false,
        banner: [],
        choose: [],
        guanfang: [],
        hot: [],
        home: [],
        loading: false,
        dialogVisible: false
      }
    },
    mounted () {
      data.getData()
      // 读取数据
      axios.post('/goods/home')
        .then((response) => {
          let { data: {list, hot, guanfang, choose}, status } = response
          if (status === 200) {
            this.banner = list
            this.hot = hot
            this.guanfang = guanfang
            this.choose = choose
          }
        })
    },
    components: {
      YShelf,
      mallGoods
    }
  }
</script>
```

* 首页中当元素挂载完毕后调取后台接口,这里有4种不同数据,将每个数据都存放在$data属性下,在dom中遍历
* 详情可参考代码中注释

> 商品列表 good.vue (节选)

```
<!-- 设置loading值,读取数据时显示遮罩层和加载提示 -->
<div v-loading="loading" element-loading-text="加载中..." style="min-height: 35vw;">
    <div class="img-item" v-if="!noResult">
    <!--商品-->
    <div class="goods-box w">
        <!-- 商品循环 根据goods循环 -->
        <mall-goods v-for="(item, index) in goods" :key="index" :msg="item"></mall-goods>
    </div>
    <!-- 
        ElementUi组件
        分页器 v-if若没有资源或读取有误,则不显示分页器 
        @size-change 当每页显示数量发生改变调用
        @current-change 当当前页改变调用
        :current-page 设置当前页
        :page-sizes 设置可以选择的每页显示的数量
        :page-size 设置每页显示数量
        layout 设置显示哪些按钮
        :total 设置总条数
    -->
    <el-pagination
        v-if="!noResult&&!error"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[4, 8, 12, 16]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    </div>
    <!-- 如果没有商品则显示 -->
    <div class="no-info" v-if="noResult">
        <div class="no-data">
            <img src="/static/images/no-search.png">
            <br> 抱歉！暂时还没有商品
        </div>
    </div>
    <!-- 如果出错则显示 -->
    <div class="no-info" v-if="error">
        <div class="no-data">
            <img src="/static/images/error.png">
            <br> 抱歉！出错了...
        </div>
    </div>
</div>

export default {
    data () {
      return {
        // 商品列表
        goods: [],
        noResult: false,
        error: false,
        min: '',
        max: '',
        loading: true,
        timer: null,
        sort: '',
        currentPage: 1,
        total: 0,
        pageSize: 8
      }
    },
    // 定义一个组件钩子 2.2新增, 当动态参数cid发生改变时触发该函数,根据cid重新读取数据,并且进行跳转
    beforeRouteUpdate (to, from, next) {
      this.loading = true
      this._getAllGoods(to.params.cid)
      next()
    },
    methods: {
      // 处理pageSize变动,重新读取后端数据
      handleSizeChange (val) {
        this.pageSize = val
        this._getAllGoods()
        this.loading = true
      },
      // 处理当前页变动,重新读取后端数据
      handleCurrentChange (val) {
        this.currentPage = val
        this._getAllGoods()
        this.loading = true
      },
      // 数据请求方法,参数发生改变就会调用(高频率调用)
      _getAllGoods (id) {
        // 获取动态参数cid
        let cid = this.$route.params.cid
        id ? cid = id : 1
        // 如果价格筛选有值,向下取整
        if (this.max !== '') {
          this.min = Math.floor(this.min)
        }
        if (this.max !== '') {
          this.max = Math.floor(this.max)
        }
        // 参数整理
        let params = {
          params: {
            page: this.currentPage,
            size: this.pageSize,
            sort: this.sort,
            priceGt: this.min,
            priceLte: this.max,
            cid: cid
          }
        }
        data.getData()
        // 读取数据,将参数传值后端
        axios.post('/goods/allGoods', params.params)
          .then((response) => {
            const { status, data: {total, list} } = response
            // 如果返回成功,将数据存入this,goods中以便利
            if (status === 200) {
              this.noResult = false
              this.total = total
              this.goods = list
              this.total === 0 && (this.noResult = true)
            }
            this.loading = false
          })
      },
      // 默认排序 sortType=1
      // 价格从低到高 sortType=2
      // 从高到低 sortType=3
      sortByPrice (v) {
        this.sort = v
        this.loading = true
        this._getAllGoods()
      }
    },
    // 当数据观测完毕调用数据读取方法
    created () {
      this._getAllGoods()
    },
```
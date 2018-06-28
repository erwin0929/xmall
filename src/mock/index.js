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

import {
  GET_USERINFO,
  RECORD_USERINFO
} from './mutation-types'
import { setStore } from '../utils/storage'
export default {
  // 记录用户信息
  [RECORD_USERINFO] (state, payLoad) {
    let {data: info} = payLoad
    state.userInfo = info
    state.login = true
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

<template>
  <div class="login v2">
    <div class="wrapper">
      <div class="dialog dialog-shadow" style="display: block; margin-top: -362px;">
        <div class="title">
        </div>
        <div v-if="loginPage" class="content">
          <ul class="common-form">
            <li class="username border-1p">
              <div class="input">
                <input type="text" v-model="ruleForm.userName" placeholder="账号">
              </div>
            </li>
            <li>
              <div class="input">
                <input type="password" v-model="ruleForm.userPwd" @keyup.enter="login" placeholder="密码">
              </div>
            </li>
            <li style="text-align: right" class="pr">
              <el-checkbox class="auto-login" v-model="autoLogin">记住密码</el-checkbox>
              <router-link :to="{name: 'register'}" class="register">注册账号</router-link>
            </li>
          </ul>
          <!--登陆-->
          <div style="margin-top: 25px">
            <el-button class="login-btn marg" type="" @click="login">{{logintxt}}</el-button>
          </div>
          <!--返回-->
          <div>
            <el-button class="login-btn" type="" @click="$router.back()">返回</el-button>
          </div>
          <div class="border"></div>
          <div class="footer">
            <div class="other">其它账号登录：</div>
            <a><img @click="open('待开发','此功能开发中...')" style="height: 15px; margin-top: 22px;" src="/static/images/other-login.png"></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import data from '../../mock/index'
import YFooter from '/common/footer'
import YButton from '/components/YButton'
import { setStore, getStore, removeStore } from '/utils/storage.js'
export default {
  data () {
    return {
      loginPage: true,
      ruleForm: {
        userName: '',
        userPwd: '',
        errMsg: ''
      },
      autoLogin: false,
      logintxt: '登录'
    }
  },
  computed: {
    count () {
      return this.$store.state.login
    }
  },
  methods: {
    open (t, m) {
      this.$notify.info({
        title: t,
        message: m
      })
    },
    message (m) {
      this.$message.error({
        message: m
      })
    },
    // 读取本地存储,若remember为真,则读取该数据自动填充表单
    getRemembered () {
      var judge = getStore('remember')
      if (judge === 'true') {
        this.autoLogin = true
        this.ruleForm.userName = getStore('localUsername')
        this.ruleForm.userPwd = getStore('localPwd')
      }
    },
    // 记住密码,若勾选此项,则存入本地存储
    rememberPass () {
      if (this.autoLogin === true) {
        setStore('remember', 'true')
        setStore('localUsername', this.ruleForm.userName)
        setStore('localPwd', this.ruleForm.userPwd)
      } else {
        setStore('remember', 'false')
        removeStore('localUsername')
        removeStore('localPwd')
      }
    },
    login () {
      this.rememberPass()
      if (!this.ruleForm.userName || !this.ruleForm.userPwd) {
        this.message('账号或者密码不能为空!')
        return false
      }
      var params = {
        userName: this.ruleForm.userName,
        userPwd: this.ruleForm.userPwd
      }
      // member/checkLogin
      data.getData()
      // 读取数据
      axios.post('/member/checkLogin', params)
        .then((response) => {
          let { data } = response
          // 登录成功判断
          if (data) {
            localStorage.setItem('userId', data.id)
            localStorage.setItem('token', 'randomToken')
            this.$router.push({
              name: 'index'
            })
          } else {
            this.message('账号或密码错误!')
          }
        })
    }
  },
  mounted () {
    this.getRemembered()
    this.open('登录提示', '测试体验账号密码：test | test')
  },
  components: {
    YFooter,
    YButton
  }
}
</script>
<style lang="scss" type="text/scss" scoped>
  $img-path: '../assets/images/';
  * {
  box-sizing: border-box;
}
.login-btn{
  width: 100%;
  display: block;
}
.marg{
  margin-bottom: 15px;
}

.login {
  overflow-x: hidden;
  overflow-y: hidden;
  .input {
    height: 50px;
    display: flex;
    align-items: center;
    input {
      font-size: 16px;
      width: 100%;
      height: 100%;
      padding: 10px 15px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
  }
  .wrapper {
    background: url(#{$img-path}bg_9b9dcb65ff.png) repeat;
    background-size: 100px;
    min-height: 800px;
    min-width: 630px;
  }
}

.v2 .dialog {
  width: 450px;
  border: 1px solid #dadada;
  border-radius: 10px;
  top: 50%;
  left: 50%;
  margin-left: -225px;
  position: absolute;
  .title {
    background: linear-gradient(#fff, #f5f5f5);
    height: auto;
    overflow: visible;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    position: relative;
    background-image: url(#{$img-path}smartisan_4ada7fecea.png);
    background-size: 140px;
    background-position: top center;
    background-repeat: no-repeat;
    height: 92px;
    margin: 23px 0 50px;
    padding: 75px 0 0;
    box-shadow: none;
    h4 {
      padding: 0;
      text-align: center;
      color: #666;
      border-bottom: 1px solid #dcdcdc;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      font-weight: 700;
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      margin: 0;
      padding: 0;
      border-bottom: 0;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      line-height: 1em;
      height: auto;
      color: #333;
      font-weight: 400;
    }
  }
  .content {
    padding: 0 40px 22px;
    height: auto;
    .common-form {
      li {
        clear: both;
        margin-bottom: 15px;
        position: relative;
      }
    }
  }
}

.dialog-shadow,
.v2 .bbs .dialog-shadow,
.v2 .dialog-shadow {
  -webkit-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
  -moz-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
  box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
}

@media screen and (min-width: 737px),
  screen and (-webkit-max-device-pixel-ratio: 1.9) and (max-width: 736px) and (min-device-width: 737px) {
  .wrapper {
    background: url(#{$img-path}con-bg_04f25dbf8e.jpg) repeat-x;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .dialog {
    background: url(#{$img-path}dialog-gray-bg.png) #fff bottom repeat-x;
    border-radius: 12px;
    display: none;
    margin: -163px 0 0 -218px;
    width: 436px;
    position: fixed;
    left: 50%;
    top: 50%;
  }
  .dialog .title h4 {
    border-bottom: #d1d1d1 solid 1px;
    box-shadow: 0 2px 6px #d1d1d1;
    color: #666;
    font-size: 20px;
    height: 61px;
    line-height: 61px;
    padding: 0 0 0 35px;
  }
  .common-form li {
    clear: both;
    margin-bottom: 15px;
    position: relative;
  }
  .auto-login {
    position: absolute;
    top: 0px;
    left: 2px;
    color: #999;
  }
  .register {
    padding: 1px 10px 0;
  }
  .border {
    margin-top: 10px;
    border-bottom: 1px solid #ccc;
  }
  .other {
    margin: 20px 5px 0 0;
    width: auto;
    color: #bbb;
    font-size: 12px;
    cursor: default;
    color: #999;
  }
  .footer {
    display: flex;
    flex-direction: row;
  }
  .agree {
    margin-bottom: 30px;
    color: #999;
  }
}

.registered {
  h4 {
    padding: 0;
    text-align: center;
    color: #666;
    border-bottom: 1px solid #dcdcdc;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    font-weight: 700;
    font-size: 20px;
    height: 60px;
    line-height: 60px;
  }
}

#wait {
  text-align: left;
  color: #999;
  margin: 0;
}
</style>

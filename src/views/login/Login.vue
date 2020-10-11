<template>
  <div class="login-container">
    <!--登录面板内容部分-->
    <div class="login-inner">
      <!--面板头部-->
      <div class="login-header">
        <div class="login-logo">
          <img src="@/assets/image/login/logo.jpg" alt="" width="300" height="150" />
        </div>
        <!--面板标题-->
        <div class="login-header-title">
          <a
            href="javascript:;"
            :class="{ current: loginMode }"
            @click.prevent="switchLoginMode(true)"
            >手机登录</a
          >
          <a
            href="javascript:;"
            :class="{ current: !loginMode }"
            @click.prevent="switchLoginMode(false)"
            >密码登录</a
          >
        </div>
      </div>
      <!--面板表单部分-->
      <div class="login-content">
        <form>
          <!--手机验证码登录部分-->
          <div :class="{ current: loginMode }" v-if="loginMode">
            <section class="login-message">
              <input
                type="text"
                maxlength="11"
                placeholder="手机号"
                v-model="phone"
              />
              <button
                v-if="countDown === 0"
                @click.prevent="getVerifyCode()"
                class="get-verification"
                :class="{ phone_right: phoneRight }"
              >
                获取验证码
              </button>
              <button v-else disabled="disabled" class="get-verification">
                已发送({{ countDown }}s)
              </button>
            </section>
            <section class="login-verification">
              <input
                type="text"
                maxlength="8"
                placeholder="验证码"
                v-model="userCode"
              />
            </section>
            <section class="login-hint">
              温馨提示：未注册小撩买菜的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">服务协议与隐私政策</a>
            </section>
          </div>
          <!--账号登录部分-->
          <div :class="{ current: !loginMode }" v-else>
            <section>
              <section class="login-message">
                <input type="tel" maxlength="11" placeholder="用户名" v-model="userName" />
              </section>
              <section class="login-verification">
                <input
                  v-if="pwdMode"
                  v-model="userPwd"
                  type="password"
                  maxlength="20"
                  placeholder="密码"
                  autocomplete="off"
                />
                <input
                  v-else
                  v-model="userPwd"
                  type="text"
                  maxlength="20"
                  placeholder="密码"
                  autocomplete="off"
                />
                <!--<input  type="text" maxlength="20" placeholder="密码" autocomplete="off" />-->
                <div class="switch-show">
                  <img
                    v-if="pwdMode"
                    @click.prevent="switchPwdMode(true)"
                    src="@/assets/image/login/hide_pwd.png"
                    class="on"
                    alt=""
                    width="20"
                  />
                  <img
                    v-else
                    @click.prevent="switchPwdMode(false)"
                    class="on"
                    src="@/assets/image/login/show_pwd.png"
                    alt=""
                    width="20"
                  />
                </div>
              </section>
              <section class="login-message">
                <input type="text" maxlength="4" placeholder="验证码" v-model="captcha" />
                <img
                  @click.prevent="getCaptcha()"
                  ref="captcha"
                  class="get-verification"
                  src="http://localhost:4000/web/kyshop/api/captcha"
                  alt="captcha"
                />
              </section>
            </section>
          </div>
          <button class="login-submit" @click.prevent="login()">登录</button>
        </form>
        <button class="login-back" @click.prevent="$router.back()">返回</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getPhoneVerifyCode, phoneCodeLogin, namePwdLogin  } from "@/service/api";
import { Toast } from "vant";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      loginMode: true, // 登陆模式
      phone: null, // 手机号
      countDown: 0, // 倒计时
      userCode: null, // 用户输入的验证码
      networkCode: null, // 网络请求获取的验证码
      userInfo: null, // 用户信息
      userName: null, // 用户名
      userPwd: null, // 用户密码
      pwdMode: true, // 密码模式，true为暗文，false为明文
      captcha: null, // 验证码
    };
  },
  computed: {
    // 验证手机号是否正确
    phoneRight() {
      return /^1[3456789]\d{9}$/.test(this.phone);
    },
  },
  methods: {
    ...mapActions(["saveUserInfo"]),
    // 切换登陆模式
    switchLoginMode(flag) {
      this.loginMode = flag;
    },
    // 获取验证码
    async getVerifyCode() {
      if (this.phoneRight) {
        this.countDown = 60;
        // 设置定时器
        let timer = setInterval(() => {
          this.countDown--;

          if (this.countDown <= 0) {
            clearInterval(timer);
          }
        }, 1000);

        // 发送请求，获取验证码
        let res = await getPhoneVerifyCode();
        console.log(res);
        this.networkCode = res.code;
      }
    },
    // 登录
    async login() {
      // 手机短信登录
      if (this.loginMode) {
        if (!this.phone) {
          // 未输入手机号
          Toast({
            message: "请输入手机号",
            duration: 500,
          });
          return;
        } else if (!this.phoneRight) {
          // 手机号不正确
          Toast({
            message: "手机号不正确",
            duration: 500,
          });
          return;
        } else if (!this.userCode) {
          // 未输入验证码
          Toast({
            message: "请输入验证码",
            duration: 500,
          });
          return;
        } else if (
          !/^\d{6}$/gi.test(this.userCode) ||
          this.userCode !== this.networkCode
        ) {
          // 验证码错误
          Toast({
            message: "验证码错误",
            duration: 500,
          });
          return;
        }

        // 发送请求，获取用户信息
        let res = await phoneCodeLogin(this.phone, this.userCode);
        if (res.success_code === 200) {
          this.userInfo = res.data;
        } else {
          this.userInfo = { message: "登陆失败，手机号或者验证码错误！" };
        }
      // 用户名和密码登录
      } else {
        // 未输入用户名
        if (!this.userName) {
          Toast({
            message: "请输入用户名",
            duration: 500,
          });
          return;
        // 未输入密码
        } else if (!this.userPwd) {
          Toast({
            message: "请输入密码",
            duration: 500,
          });
          return;
        // 未输入验证码，或者验证码错误
        } else if (!this.captcha) {
          Toast({
            message: "验证码错误",
            duration: 500,
          });
          return;
        }

        // 发送请求，获取用户信息
        let res = await namePwdLogin(this.userName, this.userPwd, this.captcha)
        console.log(res);
        if(res.success_code === 200) {
          this.userInfo = res.data
        }else {
          this.userInfo = { message: '登陆失败，用户名或者密码错误！' }
        }
      }

      // 对用户信息进行处理
      if (!this.userInfo.token) {
        Toast({
          message: this.userInfo.message,
          duration: 800,
        });
      } else {
        // 保存用户信息到本地
        this.saveUserInfo(this.userInfo);
        // 返回上个页面
        this.$router.back();
      }
    },
    // 切换密码模式
    switchPwdMode(flag) {
      this.pwdMode = !flag
    },
    // 获取随机验证码
    getCaptcha() {
      let captcha = this.$refs.captcha
      this.$set(captcha, 'src', 'http://localhost:4000/web/kyshop/api/captcha?time=' + new Date().getTime())
    }
  },
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
  background: #fff;
}

.login-container .login-inner {
  padding-top: 60px;
  width: 80%;
  margin: 0 auto;
}

.login-container .login-inner .login-header .login-logo {
  font-size: 40px;
  font-weight: bold;
  color: #75a342;
  text-align: center;
}

.login-container .login-inner .login-header .login-header-title {
  padding-top: 40px;
  padding-bottom: 10px;
  text-align: center;
}

.login-container .login-inner .login-header .login-header-title > a {
  color: #333;
  font-size: 14px;
  padding-bottom: 4px;
  text-decoration: none;
}

.login-container
  .login-inner
  .login-header
  .login-header-title
  > a:first-child {
  margin-right: 40px;
}

.login-container .login-inner .login-header .login-header-title > a.current {
  color: #75a342;
  font-weight: 700;
  border-bottom: 2px solid #75a342;
}

.login-container .login-inner .login-content > form > div {
  display: none;
}

.login-container .login-inner .login-content > form > div.current {
  display: block;
}

.login-container .login-inner .login-content > form > div input {
  width: 100%;
  height: 100%;
  padding-left: 8px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: 0;
  font: 400 14px Arial;
}

.login-container .login-inner .login-content > form > div input:focus {
  border: 1px solid #75a342;
}

.login-container .login-inner .login-content > form > div .login-message {
  position: relative;
  margin-top: 16px;
  height: 48px;
  font-size: 14px;
  background: #fff;
}

.login-container
  .login-inner
  .login-content
  > form
  > div
  .login-message
  .get-verification {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  border: 0;
  color: #ccc;
  font-size: 14px;
  background: transparent;
}

.login-container
  .login-inner
  .login-content
  > form
  > div
  .login-message
  .get-verification.phone_right {
  color: #75a342;
}

.login-container .login-inner .login-content > form > div .login-verification {
  position: relative;
  margin-top: 16px;
  height: 48px;
  font-size: 14px;
  background: #fff;
}

.login-container
  .login-inner
  .login-content
  > form
  > div
  .login-verification
  .switch-show {
  position: absolute;
  right: 10px;
  top: 12px;
}

.login-container
  .login-inner
  .login-content
  > form
  > div
  .login-verification
  .switch-show
  img {
  display: none;
}

.login-container
  .login-inner
  .login-content
  > form
  > div
  .login-verification
  .switch-show
  img.on {
  display: block;
}

.login-container .login-inner .login-content > form > div .login-hint {
  margin-top: 12px;
  color: #999;
  font-size: 12px;
  line-height: 20px;
}

.login-container .login-inner .login-content > form > div .login-hint > a {
  color: #75a342;
}

.login-container .login-inner .login-content > form .login-submit {
  display: block;
  width: 100%;
  height: 42px;
  margin-top: 30px;
  border-radius: 4px;
  background: #75a342;
  color: #fff;
  text-align: center;
  font-size: 16px;
  line-height: 42px;
  border: 0;
}

.login-container .login-inner .login-content .login-back {
  display: block;
  width: 100%;
  height: 42px;
  margin-top: 15px;
  border-radius: 4px;
  background: transparent;
  border: 1px solid #75a342;
  color: #75a342;
  text-align: center;
  font-size: 16px;
  line-height: 42px;
}
</style>
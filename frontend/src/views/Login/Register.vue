<template>
  <div class="register-father">
    <div class="nav-logo-login my-2 d-flex
     align-items-center justify-content-between">
      <div class="logo mx-5">
        <b-link
          class="logo-content"
          to="/">
          FMT
        </b-link>
      </div>
      <div class="login mx-5">
        <b-button
          class="mx-3 login-button"
          variant="outline-info"
          @click="$router.push({ path: '/login' })"
          size="lg">
          登录
        </b-button>
      </div>
    </div>
    <div class="register d-flex align-items-center justify-content-center">
      <b-form :style="{'min-width': 460 + 'px'}" @submit.prevent="onSubmit" >
<b-alert
        :show="dismissCountDown"
        variant="danger"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="dismissCountDownChanged"
>
        该账号已存在
</b-alert>
<b-alert
        :show="countDown"
        variant="success"
        @dismissed="countDown=0"
        @dismiss-count-down="countDownChanged"
>
        该页面将在{{ countDown }}秒后跳转至登录界面&nbsp;
        <b-link to="/login" class="alert-link">点击此处</b-link>立即跳转
</b-alert>
        <div class="form-header">
          注册
        </div>
        <b-form-group class="input-group-email"
                      label="邮箱地址:" label-for="input-email">
          <b-form-input
            id="input-email"
            ref="inputEmail"
            v-model="user.email"
            :state="validationEmail"
            required
            placeholder="输入邮箱"
          ></b-form-input>
          <b-form-invalid-feedback class="email-feedback"
                                   :state="validationEmail">
            请输入正确的邮箱格式
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="input-group-user-name" label="用户名:"
                      label-for="input-user-name">
          <b-form-input
            id="input-user-name"
            ref="inputUserName"
            v-model="user.userName"
            :state="validationUsername"
            required
            placeholder="输入用户名"
          ></b-form-input>
          <b-form-invalid-feedback class="username-feedback"
                                   :state="validationUsername">
            你的用户名长度必须在5-12个字符之间
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="input-group-password" label="密码:"
                      label-for="input-password">
          <b-form-input
            id="input-password"
            v-model="user.password"
            ref="inputPassword"
            :state="validationPassword"
            required
            type="password"
            placeholder="输入密码"
          ></b-form-input>
          <b-form-invalid-feedback class="password-feedback"
                                   :state="validationPassword">
            你的密码长度必须要在8-20个字符之间，只能包含字母，数字和下划线
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="input-group-password-check"
                      label="验证密码:" label-for="input-password-check">
          <b-form-input
            id="input-password-check"
            v-model="user.passwordCheck"
            ref="inputPasswordCheck"
            :state="validationPasswordCheck"
            required
            type="password"
            placeholder="再次输入密码"
          ></b-form-input>
          <b-form-invalid-feedback class="password-check-feedback"
                                   :state="validationPasswordCheck">
            密码不一致
          </b-form-invalid-feedback>
        </b-form-group>
        <div class="d-flex align-items-center justify-content-center my-3">
          <b-button
            class="mx-3 register-button"
            type="submit"
            variant="outline-primary">
            注册
          </b-button>
          <b-button
            class="mx-3 back-button"
            variant="outline-danger"
            to="/">
            返回
          </b-button>
        </div>
      </b-form>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      user: {
        userName: '',
        password: '',
        email: '',
        passwordCheck: ''
      },
      dismissCountDown: 0,
      countDown: 0,
      dismissTime: 5
    }
  },
  computed: {
    ...mapActions({
      userRegister: 'userRegister'
    }),
    validationEmail () {
      const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      return reg.test(this.user.email)
    },
    validationUsername () {
      return this.user.userName.length > 4 && this.user.userName.length < 13
    },
    validationPassword () {
      const reg = /^(\w){8,20}$/
      return !!reg.exec(this.user.password)
    },
    validationPasswordCheck () {
      if (this.user.password !== '') {
        return this.user.password === this.user.passwordCheck
      }
      return false
    },
    isSubmitReady () {
      return this.isNameReady && this.isPasswordReady &&
        this.isEmailReady && this.isPassCheckReady
    },
    isEmailReady () {
      return this.$refs.inputEmail.state
    },

    isNameReady () {
      return this.$refs.inputUserName.state
    },
    isPasswordReady () {
      return this.$refs.inputPassword.state
    },
    isPassCheckReady () {
      return this.$refs.inputPasswordCheck.state
    }
  },
  methods: {
    onSubmit () {
      if (this.isSubmitReady) {
        this.$store.dispatch('userRegister', {
          userName: this.user.userName,
          password: this.user.password,
          email: this.user.email
        })
          .then(response => {
            if (response.data.message === 'ALREADY_REGISTERED') {
              this.showFailureAlert()
            } else if (response.data.message === 'USER_REGISTER') {
              this.showSuccessAlert()
            }
          })
          .catch(error => console.log(error))
      }
    },
    countDownChanged (countDown) {
      this.countDown = countDown
      if (countDown === 0) {
        this.$router.push({ path: '/login' })
      }
    },
    dismissCountDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showSuccessAlert () {
      this.countDown = this.dismissTime
    },
    showFailureAlert () {
      this.dismissCountDown = this.dismissTime
    }
  }
}
</script>
<style scoped>
.register-father {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-logo-login {
  position: fixed;
  top: 0;
  left: 0;
  height: 90px;
  width: 100%;
}

.logo-content {
  font-family: Logo, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 60px;
  text-decoration: none;
  color: #3d493d;
}

.logo-content:hover {
  color: #3d493d;
}

.login-button {
  font-size: 24px;
}

.register {
  width: 460px;
  height: 700px;
  font-family: KaiTi, serif, sans-serif, cursive, fantasy, monospace;
  font-size: 30px;
  margin-top: 8%;
}

.form-header {
  font-size: 40px;
}

.email-feedback,
.username-feedback,
.password-feedback,
.password-check-feedback {
  font-size: 22px;
}

.register-button,
.back-button {
  font-size: 22px;
}
</style>

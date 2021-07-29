<template>
  <div id="register">
    <b-form @submit.prevent="onSubmit" v-if="show">
      <b-alert
        :show="dismissCountDown"
        variant="danger"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="dismissCountDownChanged">
        该账号已存在</b-alert>
      <b-alert
        :show="countDown"
        variant="success"
        @dismissed="countDown=0"
        @dismiss-count-down="countDownChanged">
        该页面将在{{countDown}}秒后跳转至登录界面&nbsp;
        <b-link to="/login" class="alert-link">点击此处</b-link>立即跳转
      </b-alert>
      <b-form-group id="input-group-2" label="邮箱地址:" label-for="input-2">
        <b-form-input
          id="input-2"
          ref="input2"
          v-model="user.email"
          :state="validationEmail"
          required
          placeholder="输入邮箱"
        ></b-form-input>
        <b-form-invalid-feedback :state="validationEmail">
          请输入正确的邮箱格式
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="validationEmail">
          符合要求
        </b-form-valid-feedback>
      </b-form-group>
      <b-form-group id="input-group-1" label="用户名:" label-for="input-1">
        <b-form-input
          id="input-1"
          ref="input1"
          v-model="user.userName"
          :state="validationUsername"
          required
          placeholder="输入用户名"
        ></b-form-input>
        <b-form-invalid-feedback :state="validationUsername">
          你的用户名长度必须在5-12个字符之间
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="validationUsername">
          符合要求
        </b-form-valid-feedback>
      </b-form-group>
      <b-form-group id="input-group-3" label="密码:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="user.password"
          ref="input3"
          :state="validationPassword"
          required
          placeholder="输入密码"
        ></b-form-input>
        <b-form-invalid-feedback :state="validationPassword">
          你的密码长度必须要在8-20个字符之间，只能包含字母，数字和下划线
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="validationPassword">
          符合要求
        </b-form-valid-feedback>
      </b-form-group>
      <b-form-group id="input-group-4" label="验证密码:" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="user.passwordCheck"
          ref="input4"
          :state="validationPasswordCheck"
          required
          placeholder="再次输入密码"
        ></b-form-input>
        <b-form-invalid-feedback :state="validationPasswordCheck">
          密码不一致
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="validationPasswordCheck">
          符合要求
        </b-form-valid-feedback>
      </b-form-group>
      <b-button type="submit" variant="primary">注册</b-button>
      <b-button variant="danger" to="/">返回</b-button>
    </b-form>
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
      show: true,
      dismissCountDown: 0,
      countDown: 0
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
    }
  },
  methods: {
    onSubmit () {
      if (this.isSubmitReady()) {
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
    isEmailReady () {
      return this.$refs.input2.state
    },
    isSubmitReady () {
      return this.isNameReady() && this.isPasswordReady() && this.isEmailReady() && this.isPassCheckReady()
    },
    isNameReady () {
      return this.$refs.input1.state
    },
    isPasswordReady () {
      return this.$refs.input3.state
    },
    isPassCheckReady () {
      return this.$refs.input4.state
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
      this.countDown = 5
    },
    showFailureAlert () {
      this.dismissCountDown = 3
    }
  }
}
</script>
<style scoped>
#register {
  width: 400px;
  height: 700px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -200px;
  margin-top: -250px;
}
</style>

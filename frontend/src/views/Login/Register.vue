<template>
  <div class="register-father">
    <div class="register" v-if="isFormVisible">
      <b-form @submit.prevent="onSubmit" >
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
        <b-form-group class="input-group-email" label="邮箱地址:" label-for="input-email">
          <b-form-input
            id="input-email"
            ref="inputEmail"
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
        <b-form-group class="input-group-user-name" label="用户名:" label-for="input-user-name">
          <b-form-input
            id="input-user-name"
            ref="inputUserName"
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
        <b-form-group class="input-group-password" label="密码:" label-for="input-password">
          <b-form-input
            id="input-password"
            v-model="user.password"
            ref="inputPassword"
            :state="validationPassword"
            required
            type="password"
            placeholder="输入密码"
          ></b-form-input>
          <b-form-invalid-feedback :state="validationPassword">
            你的密码长度必须要在8-20个字符之间，只能包含字母，数字和下划线
          </b-form-invalid-feedback>
          <b-form-valid-feedback :state="validationPassword">
            符合要求
          </b-form-valid-feedback>
        </b-form-group>
        <b-form-group class="input-group-password-check" label="验证密码:" label-for="input-password-check">
          <b-form-input
            id="input-password-check"
            v-model="user.passwordCheck"
            ref="inputPasswordCheck"
            :state="validationPasswordCheck"
            required
            type="password"
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
      isFormVisible: true,
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
      return this.isNameReady && this.isPasswordReady && this.isEmailReady && this.isPassCheckReady
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

.register {
  width: 400px;
  height: 700px;
}
</style>

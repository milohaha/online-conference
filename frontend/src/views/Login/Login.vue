<template>
  <div class="login-father">
    <div class="login">
      <b-form @submit.prevent="onSubmit" v-if="isFormVisible">
      <b-alert
        :show="isAlertVisible"
        variant="danger"
      >
        用户名不存在或密码错误
      </b-alert>
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
        </b-form-group>
        <b-button type="submit" variant="primary">登录</b-button>
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
        password: ''
      },
      isFormVisible: true,
      isAlertVisible: false
    }
  },
  computed: {
    ...mapActions({
      userLogin: 'userLogin'
    }),
    validationUsername () {
      return this.user.userName.length > 4 && this.user.userName.length < 13
    },
    validationPassword () {
      const reg = /^(\w){8,20}$/
      return !!reg.exec(this.user.password)
    },
    isSubmitReady () {
      return this.isNameReady && this.isPasswordReady
    },
    isNameReady () {
      return this.$refs.inputUserName.state
    },
    isPasswordReady () {
      return this.$refs.inputPassword.state
    }
  },
  methods: {
    onSubmit () {
      if (this.isSubmitReady) {
        this.$store.dispatch('userLogin', this.user)
          .then(response => {
            if (response.data.message === 'WRONG_USERNAME_OR_PASSWORD') {
              this.isAlertVisible = true
            }
          })
          .catch(error => console.log(error))
      }
    }
  }
}
</script>
<style scoped>
.login-father{
  display: flex;
  align-items: center;
  justify-content: center;
}
.login{
  width: 400px;
  height: 700px;
}
</style>

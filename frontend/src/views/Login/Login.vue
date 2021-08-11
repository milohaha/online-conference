<template>
  <div class="login-father">
    <div class="nav-logo-register my-2 d-flex
    align-items-center justify-content-between">
      <div class="logo mx-5">
        <b-link
          class="logo-content"
          to="/">
          FMT
        </b-link>
      </div>
      <div class="register mx-5">
        <b-button
          class="mx-4 register-button"
          variant="outline-info"
          @click="$router.push({ path: '/register' })"
          size="lg">
          注册
        </b-button>
      </div>
    </div>
    <div class="login d-flex justify-content-center align-items-center">
      <b-form :style="{ 'min-width':460 + 'px' }" @submit.prevent="onSubmit">
        <b-alert
        :show="isAlertVisible"
        variant="danger"
      >
        用户名不存在或密码错误
      </b-alert>
        <div class="form-header">
          登录
        </div>
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
        <div class="d-flex align-items-center justify-content-center my-3">
          <b-button
            class="mx-3 login-button"
            type="submit"
            variant="outline-primary">
            登录
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
        password: ''
      },
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
          }).then(() => {
            this.$io.emit('login', parseInt(localStorage.getItem('userID')))
          })
          .catch(error => console.log(error))
      }
    }
  }
}
</script>
<style scoped>
.login-father {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-logo-register {
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

.register-button {
  font-size: 24px;
}

.login {
  width: 460px;
  height: 700px;
  font-family: KaiTi, serif, sans-serif, cursive, fantasy, monospace;
  font-size: 30px;
}

.username-feedback,
.password-feedback {
  font-size: 22px;
}

.form-header {
  font-size: 40px;
}

.login-button,
.back-button {
  font-size: 22px;
}
</style>

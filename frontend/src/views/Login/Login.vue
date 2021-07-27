<template>
  <div id="login">
    <b-form @submit.prevent="onSubmit" v-if="show">
      <b-form-group id="input-group-1" label="用户名:" label-for="input-1">
        <b-form-input
          id="input-1"
          ref="input1"
          v-model="user.username"
          :state="validation_username"
          required
          placeholder="输入用户名"
        ></b-form-input>
        <b-form-invalid-feedback :state="validation_username">
          你的用户名长度必须在5-12个字符之间
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="validation_username">
          符合要求
        </b-form-valid-feedback>
      </b-form-group>

      <b-form-group id="input-group-3" label="密码:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="user.password"
          ref="input3"
          :state="validation_password"
          required
          placeholder="输入密码"
        ></b-form-input>
        <b-form-invalid-feedback :state="validation_password">
          你的密码长度必须要在8-20个字符之间，只能包含字母，数字和下划线
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="validation_password">
          符合要求
        </b-form-valid-feedback>
      </b-form-group>

      <b-button type="submit" variant="primary">登录</b-button>
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
        username: '',
        password: ''
      },
      show: true
    }
  },
  computed: {
    ...mapActions({
      UserLogin: 'UserLogin'
    }),
    validation_username () {
      return this.user.username.length > 4 && this.user.username.length < 13
    },
    validation_password () {
      const reg = /^(\w){8,20}$/
      return !!reg.exec(this.user.password)
    }
  },
  methods: {
    onSubmit (evt) {
      if (this.isSubmitReady()) {
        console.log(this.user)
      }
    },
    isSubmitReady () {
      return this.isNameReady() && this.isPasswordReady()
    },
    isNameReady () {
      return this.$refs.input1.state
    },
    isPasswordReady () {
      return this.$refs.input3.state
    }
  }
}
</script>
<style>
#login{
  width: 400px;
  height: 700px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -200px;
  margin-top: -350px;
}
</style>

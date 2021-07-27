<template>
  <div id="register">
    <b-form @submit.prevent="onSubmit" v-if="show">
      <b-form-group id="input-group-2" label="邮箱地址:" label-for="input-2">
        <b-form-input
          id="input-2"
          ref="input2"
          v-model="user.email"
          :state="validation_email"
          required
          placeholder="输入邮箱"
        ></b-form-input>
        <b-form-invalid-feedback :state="validation_email">
          请输入正确的邮箱格式
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="validation_email">
          符合要求
        </b-form-valid-feedback>
      </b-form-group>
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
      <b-form-group id="input-group-4" label="验证密码:" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="user.passwordCheck"
          ref="input4"
          :state="validation_password_check"
          required
          placeholder="再次输入密码"
        ></b-form-input>
        <b-form-invalid-feedback :state="validation_password_check">
          密码不一致
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="validation_password_check">
          符合要求
        </b-form-valid-feedback>
      </b-form-group>
      <b-button type="submit" variant="primary">注册</b-button>
      <b-button variant="danger" to="/">返回</b-button>
    </b-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      user: {
        username: '',
        password: '',
        email: '',
        passwordCheck: ''
      },
      show: true
    }
  },
  computed: {
    validation_email () {
      const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      return reg.test(this.user.email)
    },
    validation_username () {
      return this.user.username.length > 4 && this.user.username.length < 13
    },
    validation_password () {
      const reg = /^(\w){8,20}$/
      return !!reg.exec(this.user.password)
    },
    validation_password_check () {
      if (this.user.password !== '') {
        return this.user.password === this.user.passwordCheck
      }
      return false
    }
  },
  methods: {
    onSubmit () {
      if (this.isSubmitReady()) {
        console.log(this.user)
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
    }
  }
}
</script>
<style>
#register{
  width: 400px;
  height: 700px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -200px;
  margin-top: -350px;
}
</style>

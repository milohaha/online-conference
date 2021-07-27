<template>
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
</template>
<script>
export default {
  computed: {
    validation_email () {
      const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      return reg.test(this.user.email)
    }
  },
  methods: {
    isEmailReady () {
      return this.$refs.input2.state
    }
  }
}
</script>

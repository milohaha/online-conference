<template>
  <div>
    <div id="verification-part">
      <p>{{ msg }}</p>
      <b-button variant="outline-primary" id="agree-btn" size="sm">同意</b-button>
      <b-button variant="outline-primary" id="reject-btn" size="sm">拒绝</b-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Verification',
  props: {
    msg: { String, default: '验证消息：xxx邀请您加入会议室xxxx' },
    id: Number
  },
  methods: {}
}
</script>
<style scoped>
#verification-part {
  display: flex;
  align-items: center;
  background-color:#cedfe8;
  color: #594b67;
  padding: 15px;
  margin: 5px 10px;
}
#agree-btn, #reject-btn {
  margin: 5px 5px;
}
p {
  width: 400px;
  text-align: left;
  margin: 0;
  margin-right: 5px;
}
</style>

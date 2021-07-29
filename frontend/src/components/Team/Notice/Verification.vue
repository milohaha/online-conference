<template>
  <div>
    <div id="verificationpart">
      <p>{{ msg }}</p>
      <b-button variant="outline-primary" id="agreebtn" size="sm">同意</b-button>
      <b-button variant="outline-primary" id="rejectbtn" size="sm">拒绝</b-button>
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
#verificationpart {
  display: flex;
  align-items: center;
  background-color:#cedfe8;
  color: #594b67;
  padding: 15px;
  margin: 5px 10px;
}
#agreebtn, #rejectbtn {
  margin: 5px 5px;
}
p {
  width: 400px;
  text-align: left;
  margin: 0;
  margin-right: 5px;
}
</style>

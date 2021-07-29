<template>
  <div>
    <p>{{ sendTime }}:</p>
    <p>{{ msg }}</p>
  </div>
</template>
<script>
export default {
  name: 'message',
  props: {
    id: Number,
    msg: {
      String,
      default: '通知消息--------------------------测试用例'
    },
    sendTime: {
      String,
      default: '2021-07-28'
    }
  }
}
</script>
<style scoped>
div {
  background-color:#cedfe8;
  padding: 15px;
  margin: 5px 10px;
  color: #594b67;
}
p {
  margin: 0;
}
</style>

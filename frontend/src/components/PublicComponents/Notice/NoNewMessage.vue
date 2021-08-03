<template>
  <div class="no-new-message">
    <strong>没有新消息哦</strong>
    <img src="../../../assets/picture/nomessage.png" alt="图片加载失败">
  </div>
</template>
<script>
export default {
  name: 'NoNewMessage'
}
</script>
<style scoped>
.no-new-message {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fcf0e3;
}
.no-new-message
img,
strong {
  margin-top: 10px;
  width: 390px;
}
</style>

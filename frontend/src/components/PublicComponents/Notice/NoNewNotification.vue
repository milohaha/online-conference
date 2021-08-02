<template>
  <div class="noNewNotification">
    <strong>没有新消息哦</strong>
    <img src="../../../assets/picture/noNewMessage.png" alt="图片加载失败">
  </div>
</template>
<script>
export default {
  name: 'NoNewMessage'
}
</script>
<style scoped>
.noNewNotification {
  margin-top: 20px;
  margin-left: 15px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.noNewNotification img {
  width: 300px;
}
</style>

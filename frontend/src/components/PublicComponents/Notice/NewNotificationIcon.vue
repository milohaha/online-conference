<template>
  <div>
    <b-icon icon="bell"></b-icon>
    <div class="notification-num" v-show="newNotificationNum > 0">
      <p>{{ newNotificationNum }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'NewMsgIcon',
  props: {
    newNotificationNum: Number
  }
}
</script>
<style scoped>
.notification-num {
  background-color: #ffc90e;
  border-radius: 20px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 20px;
  right: 6px;
}

p {
  font-size: 3px;
  margin: 0;
  padding: 0;
  color: darkblue;
}
</style>

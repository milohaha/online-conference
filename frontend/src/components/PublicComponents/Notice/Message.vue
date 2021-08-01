<template>
  <div class="message">
    <strong>{{ title }}</strong>
    <div class="message-card">
      <p>{{ sendTime }}:</p>
    <div class="message-content">
      <p>{{ message }}</p>
      <b-button variant="outline-primary" size="sm" @click="read">已读</b-button>
    </div>
    </div>
  </div>
</template>
<script>
// import Api from '../../../api/index.js'
export default {
  name: 'message',
  props: {
    id: Number,
    message: String,
    sendTime: String,
    title: String
  },
  methods: {
    read () {
      this.$emit('read', this.id)
      // Api.readMessage({ userId: this.$store.state.token, noticeId: this.id })
      //   .catch((error) => console.log(error))
    }
  }
}
</script>
<style scoped>
strong {
  padding-left: 15px;
}
.message-card {
  background-color:#cedfe8;
  padding: 15px;
  margin: 5px 10px;
  color: #594b67;
  border-radius: 4px;
}
p {
  margin: 0;
  width: 465px;
}
.message-content {
  display: flex;
  align-items: center;
}
</style>

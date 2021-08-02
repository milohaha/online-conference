<template>
  <div class="message">
    <strong>{{ title }}</strong>
    <div class="message-card">
      <p>{{ sendTime }}:</p>
    <div class="message-content">
      <p><strong>{{ message }}</strong></p>
      <b-button variant="outline-primary" size="sm" @click="read">已读</b-button>
    </div>
    </div>
  </div>
</template>
<script>
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
    }
  }
}
</script>
<style scoped>
strong {
  padding-left: 15px;
}

.message-card {
  background-color: #d3e8e1;
  padding: 15px;
  margin: 5px 10px;
  color: #e44a66;
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

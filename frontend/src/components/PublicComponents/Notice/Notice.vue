<template>
  <div class="message">
    <strong>{{ notice.title }}</strong>
    <div class="message-card">
      <p>{{ notice.createdAt }}:</p>
    <div class="message-content">
      <p>{{ notice.content }}</p>
      <b-button variant="outline-primary" size="sm" @click="read">已读</b-button>
    </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'message',
  props: {
    notice: {}
  },
  computed: {
    ...mapState({
      userID: (state) => state.Login.userID
    })
  },
  methods: {
    read () {
      this.$io.emit('readNotice',
        this.userID,
        this.notice.id)
      this.$emit('read', this.notice.id)
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

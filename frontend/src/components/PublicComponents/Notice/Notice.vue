<template>
  <div class="message">
    <strong>{{ notice.title }}</strong>
    <div class="message-card">
      <div class="message-time text-success">
        {{ notice.createdAt }}
      </div>
      <div class="message-content text-primary">
        {{ notice.content }}
      </div>
      <div class="operation-button">
        <b-button
          variant="primary"
          class="mx-1"
          size="sm"
          @click="read">
          已读
        </b-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import timeFormat from '../../../methods/publicMethods.js'
export default {
  name: 'message',
  props: {
    notice: {}
  },
  computed: {
    ...mapState({
      userID: (state) => state.Login.userID
    }),
    time () {
      return timeFormat.methods.getTime(this.notice.createdAt)
    }
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
  margin: 5px 10px;
  border-radius: 5px;
  box-shadow: 1px 1px 5px #7f7f7f;
}

.message-content {
  padding: 0 15px 5px;
}

.message-time {
  padding-top: 10px;
  padding-left: 5px;
}

.operation-button {
  padding-bottom: 5px;
}
</style>

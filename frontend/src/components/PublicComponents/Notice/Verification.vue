<template>
  <div>
    <strong class="verification-title">{{ verification.title }}</strong>
    <div class="verification-card">
      <p class="verification-time">{{ verification.createdAt }}</p>
      <div class="verification-content">
        <p>{{ verification.content }}</p>
        <b-button variant="outline-primary" class="agree-button" size="sm" @click="accept">同意</b-button>
        <b-button variant="outline-primary" class="reject-button" size="sm" @click="reject">拒绝</b-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'Verification',
  props: {
    verification: {}
  },
  computed: {
    ...mapState({
      userID: (state) => state.Login.userID
    })
  },
  methods: {
    accept () {
      this.$io.emit('acceptNotice',
        this.userID,
        this.verification.id)
      this.$emit('solvedVerification', this.verification.id)
    },
    reject () {
      this.$io.emit('rejectNotice',
        this.userID,
        this.verification.id)
      this.$emit('solvedVerification', this.verification.id)
    }
  }
}
</script>
<style scoped>
.verification-card {
  background-color: #cedfe8;
  color: #594b67;
  border-radius: 4px;
  margin: 5px 10px;
}

.verification-content {
  display: flex;
  align-items: center;
  padding: 0 15px 5px;
}

.verification-time,
.verification-title {
  padding-top: 10px;
  padding-left: 15px;
}

.agree-button,
.reject-button {
  margin: 5px 5px;
}

p {
  width: 400px;
  text-align: left;
  margin: 0 5px;
}
</style>

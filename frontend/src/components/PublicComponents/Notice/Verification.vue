<template>
  <div>
    <strong class="verification-title">{{ title }}</strong>
    <div class="verification-card">
      <p class="verification-time">{{ time }}</p>
      <div class="verification-content">
        <p>{{ message }}</p>
        <b-button variant="outline-primary" class="agree-btn" size="sm" @click="agree">同意</b-button>
        <b-button variant="outline-primary" class="reject-btn" size="sm" @click="reject">拒绝</b-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Verification',
  props: {
    title: String,
    message: String,
    id: Number,
    time: String
  },
  methods: {
    agree () {
      this.$emit('solved', this.id)
    },
    reject () {
      this.$emit('solved', this.id)
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
  padding: 5px 15px;
  padding-top: 0;
}

.verification-time,
.verification-title {
  padding-top: 10px;
  padding-left: 15px;
}

.agree-btn,
.reject-btn {
  margin: 5px 5px;
}

p {
  width: 400px;
  text-align: left;
  margin: 0;
  margin-right: 5px;
  margin-left: 5px;
}
</style>

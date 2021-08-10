<template>
  <div>
    <div class="verification-card my-3">
      <div class="verification-time text-success">
        {{ verification.createdAt }}
      </div>
      <div class="verification-content text-primary">
        {{ verification.content }}
      </div>
      <div class="operation-button">
        <b-button
          variant="info"
          class="agree-button mx-1"
          size="sm"
          @click="accept">
          同意
        </b-button>
        <b-button
          variant="warning"
          class="reject-button mx-1"
          size="sm"
          @click="reject">
          拒绝
        </b-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import timeFormat from '../../../methods/publicMethods.js'
export default {
  name: 'Verification',
  props: {
    verification: {}
  },
  computed: {
    ...mapState({
      userID: (state) => state.Login.userID
    }),
    time: function () {
      return timeFormat.methods.getTime(this.verification.createdAt)
    }
  },
  methods: {
    accept () {
      this.$io.emit('acceptNotice',
        this.userID,
        this.verification.id)
      this.$emit('solveVerification', this.verification.id)
    },
    reject () {
      this.$io.emit('rejectNotice',
        this.userID,
        this.verification.id)
      this.$emit('solveVerification', this.verification.id)
    }
  }
}
</script>
<style scoped>
.verification-card {
  background-color: #cedfe8;
  color: #594b67;
  border-radius: 5px;
  box-shadow: 1px 1px 5px #7f7f7f;
  margin: 5px 10px;
}

.verification-content {
  padding: 0 15px 5px;
}

.verification-time {
  padding-top: 10px;
  padding-left: 5px;
}

.operation-button {
  padding-bottom: 5px;
}
</style>

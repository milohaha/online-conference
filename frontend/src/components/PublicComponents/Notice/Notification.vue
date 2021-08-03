<template>
  <div>
  <b-dropdown size="lg" variant="link" right no-caret id="message-box">
    <template #button-content>
      <new-message-icon
      :newMessageNum="newMessageNum"
      @click="updateMessages"
      ></new-message-icon>
    </template>
    <b-tabs pills align="center" class="message-box">
      <b-tab title="验证消息" active class="message">
        <verification v-for="verification in verifications"
          :key="verification.id"
          :verification="verification"
          @solvedVerification='solveVerification'
        >
        </verification>
        <no-new-message v-if="newVerificationNum === 0"/>
        </b-tab>
      <b-tab title="通知消息" class="notification">
        <notice v-for="notice in notices"
          :key="notice.id"
          :notice="notice"
          @read='readNotice'
        >
        </notice>
        <no-new-message v-if="newNoticeNum === 0" />
      </b-tab>
    </b-tabs>
  </b-dropdown>
</div>
</template>
<script>
import Verification from './Verification.vue'
import Notice from './Notice.vue'
import NewMessageIcon from './NewMessage.vue'
import NoNewMessage from './NoNewMessage.vue'
import { mapState } from 'vuex'
export default {
  name: 'Notification',
  data: function () {
    return {
      maxMessageNum: 99,
      verifications: [],
      notices: []
    }
  },
  computed: {
    ...mapState({
      userID: (state) => state.Login.userID,
      teamID: (state) => state.Team.teamID
    }),
    newVerificationNum () {
      const num = this.verifications.length
      return num > this.maxMessageNum ? this.maxMessageNum : num
    },
    newNoticeNum () {
      const num = this.notices.length
      return num > this.maxMessageNum ? this.maxMessageNum : num
    },
    newMessageNum () {
      const num = this.newVerificationNum + this.newNoticeNum
      return num > this.maxMessageNum ? this.maxMessageNum : num
    }
  },
  methods: {
    updateNotices () {
      this.$store.dispatch('getMessages', {
        type: 'notice',
        userID: this.userID
      })
        .then(response => {
          const data = response.data.data
          this.notices = []
          for (const notice of data) {
            this.notices.push(notice)
          }
        })
    },
    updateVerifications () {
      this.$store.dispatch('getMessages', {
        type: 'verification',
        userID: this.userID
      })
        .then(response => {
          const data = response.data.data
          this.verifications = []
          for (const verification of data) {
            this.verifications.push(verification)
          }
        })
    },
    updateMessages () {
      this.updateNotices()
      this.updateVerifications()
    },
    preventDefaultCloseOfDropdown () {
      this.$root.$once('bv::dropdown::hide', bvEvent => {
        bvEvent.preventDefault()
      })
    },
    readNotice (noticeID) {
      this.notices.splice(this.notices.findIndex((notice) => notice.id === noticeID), 1)
      this.preventDefaultCloseOfDropdown()
    },
    solveVerification (noticeID) {
      this.verifications.splice(this.verifications.findIndex((verification) => verification.id === noticeID), 1)
      this.preventDefaultCloseOfDropdown()
    }
  },
  components: {
    Verification,
    Notice,
    NewMessageIcon,
    NoNewMessage
  }
}
</script>
<style scoped>
.message-box {
  width: 595px;
}

.message {
  overflow-y: scroll;
  max-height: 270px;
}
</style>

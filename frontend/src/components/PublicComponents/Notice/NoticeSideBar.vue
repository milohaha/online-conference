<template>
  <div>
    <div class="bell">
      <span class="fmtfont fmt-notice" v-b-toggle.notice-sidebar @click="clickSideBar"></span>
      <div
        class="message-badge"
        v-b-toggle.notice-sidebar
        v-if="newMessageNum > 0"
        @click="clickSideBar">
        {{ newMessageNum }}
      </div>
    </div>
    <b-sidebar
      id="notice-sidebar"
      right
      sidebar-class="notice-sidebar"
      width="400px"
      shadow="lg"
      no-header-close>
      <template #header>
        <div
          class="d-flex align-items-center justify-content-between sidebar-header">
          <b-dropdown
            split
            :text="type"
            toggle-text=""
            variant="light"
            menu-class="dropdown-menu"
            @click="updateMessages">
            <b-dropdown-item-button @click="pickNotice">通知消息</b-dropdown-item-button>
            <b-dropdown-item-button @click="pickVerification">验证消息</b-dropdown-item-button>
          </b-dropdown>
          <span
            v-b-toggle.notice-sidebar
            class="fmtfont fmt-close close-button mx-2"
            @click="clickSideBar"></span>
        </div>
      </template>
      <div class="message">
        <div v-if="!isNotice" class="px-3">
          <verification
            v-for="verification in verifications"
            :key="verification.id"
            :verification="verification"
            @solveVerification='solveVerification'>
          </verification>
        </div>
        <div v-if="isNotice" class="px-3">
          <notice
            v-for="notice in notices"
            :key="notice.id"
            :notice="notice"
            @read='readNotice'>
          </notice>
        </div>
      </div>
    </b-sidebar>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Verification from '../../PublicComponents/Notice/Verification'
import Notice from '../../PublicComponents/Notice/Notice'
export default {
  data: function () {
    return {
      maxMessageNum: 99,
      isNotice: true,
      verifications: [],
      notices: [],
      isOpen: false
    }
  },
  created () {
    this.$io.on('verificationEvent', () => {
      this.updateMessages()
    })
    this.$io.on('noticeEvent', () => {
      this.updateMessages()
    })
    this.updateMessages()
  },
  computed: {
    ...mapState({
      userID: (state) => state.Login.userID,
      teamID: (state) => state.Team.teamID
    }),
    type () {
      return this.isNotice ? '通知消息' : '验证消息'
    },
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
    pickNotice () {
      this.isNotice = true
      this.updateNotices()
    },
    pickVerification () {
      this.isNotice = false
      this.updateVerifications()
    },
    async updateNotices () {
      await this.$store.dispatch('getMessages', {
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
    async updateVerifications () {
      await this.$store.dispatch('getMessages', {
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
    async updateMessages () {
      await this.updateNotices()
      await this.updateVerifications()
    },
    async readNotice (noticeID) {
      await this.updateNotices()
    },
    async solveVerification (noticeID) {
      setTimeout(() => {
        this.updateMessages()
      }, 100)
    },
    clickSideBar () {
      this.isOpen = !this.isOpen
      this.$emit('clickSideBar', this.isOpen)
    }
  },
  components: {
    Verification,
    Notice
  }
}
</script>
<style scoped>
>>> .dropdown-menu {
  border-radius: 5px;
  box-shadow: 1px 1px 1px #afaeae;
}

.bell {
  width: 40px;
  height: 40px;
}

.message-badge {
  background-color: #cd1515;
  color: #eee;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 9px;
  text-align: center;
  position: relative;
  top: -32px;
  left: 13px;
}

.sidebar-header {
  width: 100%;
  font-size: 24px;
}
.notice-sidebar {
  position: absolute;
  z-index: 200;
}
</style>

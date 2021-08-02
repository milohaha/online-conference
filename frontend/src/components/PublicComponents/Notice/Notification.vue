<template>
  <div>
  <b-dropdown size="lg" variant="link" right no-caret id="message-box">
    <template #button-content>
      <new-notification-icon
      :newNotificationNum="newNotificationNum"
      ></new-notification-icon>
    </template>
    <b-tabs pills align="center" class="notification-box">
      <b-tab title="验证消息" active class="notification">
        <verification v-for="verification in verifications"
          :key="verification.noticeId"
          :id="verification.noticeId"
          :title="verification.title"
          :time="verification.sendTime"
          :message="verification.content"
          @solved='solveVerification'
        >
        </verification>
        <no-new-message v-if="newVerificationNum === 0"/>
        </b-tab>
      <b-tab title="通知消息" class="notification">
        <message v-for="message in messages"
          :key="message.noticeId"
          :id="message.noticeId"
          :title="message.title"
          :sendTime="message.sendTime"
          :message="message.content"
          @read='readMessage'
        >
        </message>
        <no-new-message v-if="newMessageNum === 0" />
      </b-tab>
    </b-tabs>
  </b-dropdown>
</div>
</template>
<script>
import Verification from './Verification.vue'
import Message from './Message.vue'
import NewNotificationIcon from './NewNotificationIcon.vue'
import NoNewMessage from './NoNewNotification'
export default {
  name: 'Notification',
  data: function () {
    return {
      maxNotificationNum: 99,
      verifications: [
        {
          noticeId: 1,
          title: '团队邀请',
          content: 'xx邀请你加入xxx团队',
          sendTime: '2021-01-02'
        },
        {
          noticeId: 2,
          title: '会议邀请',
          content: 'xx邀请你加入xx会议室',
          sendTime: '2021-05-06'
        },
        {
          noticeId: 3,
          title: '团队邀请',
          content: 'xx邀请你加入xxx团队',
          sendTime: '2021-01-03'
        }
      ],
      messages: [
        {
          noticeId: 3,
          title: '系统通知',
          content: '您已成功加入团队xx',
          sendTime: '2022-03-04'
        },
        {
          noticeId: 4,
          title: '系统通知',
          content: '您已成功加入xx会议室',
          sendTime: '2001-08-25'
        }
      ]
    }
  },
  components: {
    Verification,
    Message,
    NewNotificationIcon,
    NoNewMessage
  },
  methods: {
    preventDefaultCloseOfDropdown () {
      this.$root.$once('bv::dropdown::hide', bvEvent => {
        bvEvent.preventDefault()
      })
    },
    readMessage (noticeId) {
      this.messages.splice(this.messages.findIndex((message) => message.noticeId === noticeId), 1)
      this.preventDefaultCloseOfDropdown()
    },
    solveVerification (noticeId) {
      this.verifications.splice(this.verifications.findIndex((verification) => verification.noticeId === noticeId), 1)
      this.preventDefaultCloseOfDropdown()
    }
  },
  computed: {
    newVerificationNum () {
      const num = this.verifications.length
      return num > this.maxNotificationNum ? this.maxNotificationNum : num
    },
    newMessageNum () {
      const num = this.messages.length
      return num > this.maxNotificationNum ? this.maxNotificationNum : num
    },
    newNotificationNum () {
      const num = this.newVerificationNum + this.newMessageNum
      return num > this.maxNotificationNum ? this.maxNotificationNum : num
    }
  },
  created: function () {
    this.$io.on('verificationEvent', () => {
      this.verifications.length += 1
    })
    this.$io.on('noticeEvent', () => {
      this.messages.length += 1
    })
  }
}
</script>
<style scoped>
.notification-box {
  width: 595px;
}

.notification {
  overflow-y: scroll;
  max-height: 270px;
}
</style>

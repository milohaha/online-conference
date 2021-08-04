<template>
  <div>
    <div class="logo">
      <logo/>
      <div class="notice-exit">
        <notification id="notification"></notification>
        <b-button variant="outline-primary" v-b-toggle.member-list class="check-member-button">成员列表</b-button>
        <b-button variant="outline-primary" @click="exitConference">退出</b-button>
      </div>
    </div>
    <div class="function-button"></div>
    <b-button class="video">视频</b-button>
    <b-sidebar id="member-list">成员列表</b-sidebar>
  </div>
</template>
<script>
import Logo from '../../components/PublicComponents/Logos/Logo.vue'
import Notification from '../../components/PublicComponents/Notice/Notification.vue'
export default {
  methods: {
    exitConference () {
      this.$router.push({ path: '/team/teamofuser' })
      // TODO 向后端发送成员暂时离开信息以维护在线成员列表
    }
  },
  components: {
    Logo,
    Notification
  }
}
</script>
<style scoped>
.logo {
  padding: 10px;
  height: 10vh;
  display: flex;
  background-color: #04294f;
  align-items: center;
  justify-content: space-between;
}
.notice-exit {
  display: flex;
  align-items: center;
}
.check-member-button {
  margin-right: 15px;
}
.video {
  margin-top: 600px;
}
</style>

<template>
<div class="team-page">
  <div class="logo">
    <logo/>
    <div class="notice-user">
      <notification id="notification"></notification>
      <user-logo/>
    </div>
  </div>
  <div class="team-page-main-part">
    <b-nav vertical class="nav" id="firstnav" align="start" pills>
      <b-nav-item to="/team/recentfile" class="recent-file">
        <b-icon icon='file-earmark-richtext'></b-icon>
        最近文件
      </b-nav-item>
      <b-nav-item to="/team/teammanage" class="team-manage">
        <b-icon icon='people'></b-icon>
        团队管理
      </b-nav-item>
    </b-nav>
    <div class="changing-part">
      <router-view></router-view>
    </div>
</div>
</div>
</template>
<script>
import Notification from '../../components/PublicComponents/Notice/Notification.vue'
import Logo from '../../components/PublicComponents/Logos/Logo.vue'
import UserLogo from '../../components/PublicComponents/Logos/UserLogo.vue'
export default {
  components: {
    Notification,
    Logo,
    UserLogo
  }
}
</script>
<style scoped>
* {
  font-family: Simsun, serif, sans-serif, cursive, fantasy, monospace;
}

.team-page {
  margin: 0;
}

.logo {
  padding: 10px;
  height: 10vh;
  display: flex;
  background-color: #04294f;
  align-items: center;
  justify-content: space-between;
}

.notice-user {
  display: flex;
  align-items: center;
}

.nav {
  width: 10vw;
  height: 90vh;
  background-color: #faf5f0;
  font-size: 17px;
  font-weight: 500;
}

.changing-part {
  padding: 60px;
  width: 90vw;
  background-color: #fff;
}

.recent-file,
.team-manage {
  padding: 10px;
}

.team-page-main-part {
  display: flex;
}
</style>

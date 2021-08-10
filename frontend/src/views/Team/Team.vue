<template>
<div class="team-page">
  <div class="logo bg-light">
    <logo/>
    <div class="notice-user">
      <notice-side-bar></notice-side-bar>
      <user-logo/>
    </div>
  </div>
  <div class="body d-flex">
    <div class="side-nav flex-column mx-3">
      <div class="my-3">
        <b-icon
          icon='file-earmark-richtext'
          size="md"
          class="mx-2"></b-icon>
        <b-link class="recent-file">
          <span>最近文件</span>
        </b-link>
      </div>
      <div class="my-3">
        <b-icon
          icon='people'
          size="md"
          class="mx-2"></b-icon>
        <b-link class="team-manage" to="/team/teampage">
          <span>团队管理</span>
        </b-link>
      </div>
      <hr>
    </div>
    <div class="team-manage-page">
      <router-view></router-view>
    </div>
  </div>
</div>
</template>
<script>
import Logo from '../../components/PublicComponents/Logos/Logo.vue'
import UserLogo from '../../components/PublicComponents/Logos/UserLogo.vue'
import NoticeSideBar from '../../components/PublicComponents/Notice/NoticeSideBar'
export default {
  components: {
    Logo,
    UserLogo,
    NoticeSideBar
  }
}
</script>
<style scoped>
* {
  font-family: Simsun, serif, sans-serif, cursive, fantasy, monospace;
}

.logo {
  padding: 10px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.notice-user {
  display: flex;
  align-items: center;
}

.side-nav {
  width: 130px;
  height: 200px;
}

.side-nav div span {
  font-size: 20px;
}

.recent-file,
.team-manage {
  text-decoration: none;
}

.team-manage-page {
  position: absolute;
  top: 78px;
  left: 164px;
  width: 1360px;
}
</style>

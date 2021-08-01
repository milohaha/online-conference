<template>
<div id="team-page">
  <header class="logo">
    <b-link to="/">
      <img alt="logo" src="../../assets/picture/fmtOrange.png">
    </b-link>
    <notification id="notification"></notification>
  </header>
  <body>
    <b-nav vertical tabs class="nav" id="firstnav" align="start">
      <b-nav-item @click="viewFile" to="/team/recentfile" id="recentfile">最近文件</b-nav-item>
      <b-nav-item @click="manageTeam" id="manageteam">团队管理</b-nav-item>
    </b-nav>
    <b-nav vertical pills class="nav" id="secondnav" v-if="isManagingTeam">
      <b-nav-item to="/team/teambuild">创建团队</b-nav-item>
      <b-nav-item to="/team/teamjoin">加入团队</b-nav-item>
      <b-nav-item v-b-toggle.created>我创建的团队</b-nav-item>
      <b-collapse id="created">
        <b-nav vertical small>
          <b-nav-item>团队1</b-nav-item>
          <b-nav-item>团队2</b-nav-item>
        </b-nav>
      </b-collapse>
      <b-nav-item v-b-toggle.joined>我加入的团队</b-nav-item>
      <b-collapse id="joined">
        <b-nav vertical small>
          <b-nav-item>团队3</b-nav-item>
          <b-nav-item>团队4</b-nav-item>
        </b-nav>
      </b-collapse>
    </b-nav>
    <div id="changing-part">
      <router-view></router-view>
    </div>
  </body>
</div>
</template>
<script>
import Notification from '../../components/PublicComponents/Notice/Notification.vue'
export default {
  data: function () {
    return {
      isManagingTeam: false
    }
  },
  methods: {
    manageTeam () {
      this.isManagingTeam = true
    },
    viewFile () {
      this.isManagingTeam = false
    }
  },
  components: {
    Notification
  }
}
</script>
<style scoped>
* {
  font-family: Simsun, Serif, Sans-serif, cursive, fantasy, Monospace;
}
body {
  display: flex;
}
#team-page {
  margin: 0;
}
.logo {
  padding: 20px;
  display: flex;
  background-color:#04294f;
}
.nav {
  width: 115px;
  height: 700px;
  background-color: #eeeeee;
}
#secondnav {
  padding-top: 41px;
  width: 150px;
}
#created {
  display: block;
}
#changing-part {
  padding: 40px;
  width: auto;
}
img {
  width: 80px;
}
#notification {
  float: right;
  position: absolute;
  right: 20px;
  top: 15px;
}
</style>

<template>
<div id="all">
  <header class="logo">
    <img src="../../assets/picture/fmt.png">
  </header>
  <body>
    <b-nav vertical tabs class="nav" id="nav1" align="start">
      <b-nav-item @click="viewFile" to="/team/recentfile">最近文件</b-nav-item>
      <b-nav-item @click="manageTeam">团队管理</b-nav-item>
      <b-nav-item>
        通知
        <b-badge variant="info">99+</b-badge>
      </b-nav-item>
    </b-nav>
    <b-nav vertical pills class="nav" id="nav2" v-if="IsManagingTeam">
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
    <router-view></router-view>
  </body>
</div>
</template>
<script>
export default {
  data: function () {
    return {
      IsManagingTeam: false
    }
  },
  methods: {
    manageTeam () {
      this.IsManagingTeam = true
    },
    viewFile () {
      this.IsManagingTeam = false
    }
  }
}
</script>
<style scoped>
* {
  font-family: MicrosoftYaHei;
}
#all {
  margin: 50px 50px;
}
.logo {
  padding: 15px;
  display: flex;
}
body {
  padding: 15px;
  display: flex;
}
.nav {
  width: 115px;
  /*ackground-color: #FAF3F3;*/
  background-color: #f2f6fa;
}
#nav2 {
  padding-top: 41px;
  width: 150px;
}
#created {
  display: block;
}

</style>

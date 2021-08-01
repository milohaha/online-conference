<template>
  <div class="home">
    <person-page></person-page>
    <b-nav tabs align="center">
      <b-nav-item active>Home</b-nav-item>
      <b-nav-item to="/team">to team</b-nav-item>
      <b-nav-item>Another Link</b-nav-item>
    </b-nav>
    <b-jumbotron class="title" style="text-align: center">
      <template v-slot:header>富媒体实时协作平台</template>
      <template v-slot:lead>
        让线上会议室成为可能
      </template>
    </b-jumbotron>
    <div>
      <b-button pill variant="outline-success" to="/login" class="login-btn" v-if="!isLogin">登录</b-button>
    </div>
    <div>
      <b-button variant="link" to="/register" class="register-btn" v-if="!isLogin">点我注册</b-button>
    </div>
  </div>
</template>
<script>
import PersonPage from '../../components/PersonPage/PersonPage'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    isLogin () {
      return this.userInfo
    }
  },
  components: {
    PersonPage
  }
}
</script>
<style scoped>
.home {
  background-image: url("../../assets/picture/bkgdpic.png");
  background-repeat: no-repeat;
  background-color: #04294f;
  height: 100vh;
  color: #fff;
  font-family: 字魂27号-布丁体, Helvetica, Arial, Verdana, Tahoma, sans-serif;
}
.title {
  margin-left: auto;
  margin-right: 100px;
  margin-top: 200px;
  width: fit-content;
}
div + div {
  display: flex;
}
.login-btn {
  margin-left: auto;
  margin-right: 350px;
  margin-top: 20px;
}
.register-btn {
  margin-left: auto;
  margin-right: 332px;
}
</style>

<template>
  <div class="home-page">
    <div class="nav-bar d-flex justify-content-between align-items-center">
      <div class="logo">
        <b-link
          class="logo-content mx-3"
          disabled>
          FMT
        </b-link>
      </div>
      <div class="d-flex align-items-center justify-content-around right-bar">
        <div class="home">
          <b-link
            class="home-link"
            disabled>
            主页
          </b-link>
        </div>
        <div class="login">
          <b-link
            @click="$router.push({ path: '/login' })"
            class="login-btn"
            v-if="!isLogin">登录</b-link>
        </div>
        <div class="register">
          <b-link
            @click="$router.push({ path: '/register' })"
            class="register-btn"
            v-if="!isLogin">注册</b-link>
        </div>
        <div class="sign-out">
          <b-link
            @click="signOut"
            class="sign-out-btn"
            v-if="isLogin">注销</b-link>
        </div>
        <div class="person-page">
          <b-dropdown
            no-caret
            right
            variant='link'
            size='sm'
            class="person-page mx-3"
            v-if="isLogin"
            v-b-popover.hover.bottom="'个人主页'">
            <template v-slot:button-content>
              <img src="../../assets/picture/astronaut.png"
                   alt="userLogo" class="user-logo">
            </template>
            <b-dropdown-item>
              <div class="d-flex align-items-center">
                <div>
                  <b-avatar variant="info"
                            src="https://placekitten.com/300/300"
                            class="mx-1"></b-avatar>
                </div>
                <div class="flex-column">
                  <div>
                    <Strong >{{ userName }}</Strong>
                  </div>
                  <div>
                    <small>{{ email }}</small>
                  </div>
                </div>
              </div>
            </b-dropdown-item>
            <b-dd-divider></b-dd-divider>
            <b-dropdown-item-button @click="enterTeam"
                                    class="enter-team-button">
              进入团队
            </b-dropdown-item-button>
          </b-dropdown>
        </div>
      </div>
    </div>

    <div class="slogan">
      <div class="header my-2">
        <img src="../../assets/picture/slogan-1.png" alt="Slogan 1">
      </div>
      <div class="leader text-center my-2">
        <img src="../../assets/picture/slogan-2.png" alt="Slogan 2">
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Api from '../../api/index'
export default {
  data: function () {
    return {
      userName: '',
      email: ''
    }
  },
  computed: {
    ...mapState({
      isUserLogin: (state) => state.Login.isUserLogin,
      userID: (state) => state.Login.userID
    }),
    isLogin () {
      return this.isUserLogin
    }
  },
  created () {
    if (this.isLogin) {
      Api.getUserInfo({
        userID: this.userID
      }).then((response) => {
        this.userName = response.data.userName
        this.email = response.data.email
      })
    }
  },
  methods: {
    enterTeam () {
      this.$router.push({ path: '/team' })
    },
    signOut () {
      this.$store.dispatch('userLogout')
    }
  },
  components: {
  }
}
</script>
<style scoped>
.home-page {
  background-image: url("../../assets/picture/bkgdpic.png");
  background-repeat: no-repeat;
  background-color: #04294f;
  height: 100vh;
}

.nav-bar {
  width: 100%;
  height: 70px;
  position: fixed;
  top: 0;
  border-bottom: 1px solid #7f7f7f;
}

.right-bar {
  width: 300px;
  font-family: KaiTi, serif, sans-serif, cursive, fantasy, monospace;
  color: #eee;
  font-size: 30px;
}

.login-btn,
.register-btn,
.sign-out-btn {
  text-decoration: none;
  color: #eee;
  font-size: 30px;
}

.logo-content {
  font-family: Logo, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 60px;
  text-decoration: none;
  color: #3d493d;
}

.home-link {
  text-decoration: none;
  color: #eee;
}

.user-logo {
  width: 55px;
  height: 55px;
}

.enter-team-button {
  text-align: center;
  font-size: 20px;
}

.slogan {
  position: absolute;
  top: 30%;
  right: 3%;
}

.slogan .header img {
  width: 800px;
}

.slogan .leader img {
  margin-top: 35px;
  width: 500px;
}
</style>

<template>
  <div>
    <b-dropdown no-caret right variant='link' size='sm' id="person-page" v-if="isLogin">
      <template v-slot:button-content>
        <img src="../../assets/picture/astronaut.png" alt="userLogo" class="user-logo">
      </template>
      <b-dropdown-item-button @click="enterTeam" class="enter-team-button">
          进入团队
      </b-dropdown-item-button>
      <b-dd-divider></b-dd-divider>
      <b-dropdown-item-button @click="signOut" class="sign-out-button">
        <b-icon icon="power"></b-icon>&nbsp;注销
      </b-dropdown-item-button>
    </b-dropdown>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      isUserLogin: (state) => state.Login.isUserLogin
    }),
    ...mapActions({
      userLogout: 'userLogout'
    }),
    isLogin () {
      return this.isUserLogin
    }
  },
  methods: {
    enterTeam () {
      this.$router.push({ path: '/team' })
    },
    signOut () {
      this.$store.dispatch('userLogout')
    }
  }
}
</script>
<style>
#person-page {
  position: absolute;
  right: 40px;
}

.user-logo {
  width: 45px;
  height: 45px;
}

.enter-team-button {
  text-align: center;
}

.sign-out-button {
  text-align: center;
}
</style>

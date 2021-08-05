<template>
  <div>
    <b-dropdown no-caret right variant='link' size='sm'>
      <template v-slot:button-content>
        <img src="../../../assets/picture/astronaut.png" alt="userLogo" class="user-logo">
      </template>
      <b-dropdown-item @click="exitTeam">
        <b-icon icon='door-open'></b-icon>
        回到主页
      </b-dropdown-item>
      <b-dropdown-item @click="signOut">
        <b-icon icon='cursor-fill'></b-icon>
        注销用户
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'UserLogo',
  computed: {
    ...mapActions({
      userLogout: 'userLogout'
    })
  },
  methods: {
    exitTeam () {
      this.$router.push({ path: '/' })
    },
    signOut () {
      this.$store.dispatch('userLogout')
    }
  }
}
</script>
<style scoped>
.user-logo {
  width: 45px;
  height: 45px;
}
</style>

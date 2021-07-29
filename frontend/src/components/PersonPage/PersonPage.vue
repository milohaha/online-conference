<template>
  <div>
    <b-dropdown offset="2em" variant="primary" id="person-page" v-if="isLogin" right>
      <template #button-content>
        <b-icon icon="person-circle" style="width: 20px; height: 20px"></b-icon>
      </template>
      <b-dropdown-item-button @click="enterTeam" style="text-align: center">
          进入团队
      </b-dropdown-item-button>
      <b-dd-divider></b-dd-divider>
      <b-dropdown-item-button @click="signOut" style="text-align: center">
        <b-icon icon="power"></b-icon>&nbsp;注销
      </b-dropdown-item-button>
    </b-dropdown>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    ...mapActions({
      userLogout: 'userLogout'
    }),
    isLogin () {
      return this.userInfo
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
#person-page{
  position: absolute;
  top: 5px;
  right: 40px;
}
</style>

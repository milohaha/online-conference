<template>
  <div>
    <b-dropdown no-caret right variant='light'>
      <template v-slot:button-content>
        <img src="../../../assets/picture/astronaut.png" alt="userLogo" class="user-logo">
      </template>
      <b-dropdown-item>
        <div class="d-flex align-items-center">
          <div>
            <b-avatar variant="info" src="https://placekitten.com/300/300" class="mx-1"></b-avatar>
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
      <b-dropdown-item class="text-center" @click="exitTeam">
        <b-icon icon='door-open'></b-icon>
        回到主页
      </b-dropdown-item>
      <b-dd-divider></b-dd-divider>
      <b-dropdown-item class="text-center" @click="signOut">
        <b-icon icon='cursor-fill'></b-icon>
        注销用户
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import Api from '../../../api/index'
export default {
  name: 'UserLogo',
  data: function () {
    return {
      userName: '',
      email: ''
    }
  },
  computed: {
    ...mapActions({
      userLogout: 'userLogout'
    }),
    ...mapState({
      userID: (state) => state.Login.userID
    })
  },
  created () {
    Api.getUserInfo({
      userID: this.userID
    }).then((response) => {
      this.userName = response.data.userName
      this.email = response.data.email
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
  width: 35px;
  height: 35px;
}
</style>

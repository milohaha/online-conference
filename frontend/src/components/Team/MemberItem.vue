<template>
  <div class="member-item">
    <div class="d-flex justify-content-around align-items-center h-auto">
      <b-avatar
        class="mr-0"
        variant="primary"
        :icon=icon
        size="3rem"
      ></b-avatar>
      <div class="user-information">
        <p class="text-lg-start">用户名: {{ member.userName }}</p>
        <p class="text-lg-start">id: {{ member.id }}</p>
        <p class="text-lg-start">邮箱: {{ member.email }}</p>
      </div>
    </div>
      <remove-team-member
        :userID="member.id"
        :modalID="member.userName"
        v-if="userID === founderID && member.id !== founderID"
        @remove="removeTeamMember"
      ></remove-team-member>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import RemoveTeamMember from './RemoveTeamMember.vue'
export default {
  props: {
    icon: {
      String,
      default: 'person-fill'
    },
    member: Object,
    founderID: Number
  },
  components: {
    RemoveTeamMember
  },
  methods: {
    removeTeamMember (userID) {
      this.$emit('removeMember', userID)
    }
  },
  computed: {
    ...mapState({
      userID: (state) => state.Login.userID
    })
  }
}
</script>
<style scoped>
.user-information {
  display: flex;
  flex-direction: column;
  text-align-last: left;
  flex-grow: 1;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

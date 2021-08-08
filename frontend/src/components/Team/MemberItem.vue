<template>
  <div class="member-item">
    <div class="d-flex justify-content-center align-items-center h-auto">
      <div class="little-green-dot" v-if="isActive"></div>
      <b-avatar
        variant="info"
        src="https://placekitten.com/300/300"
        class="mx-3"
        size="4rem"></b-avatar>
      <div class="user-information mx-2">
        <div
          class="text-lg-start d-flex align-items-center justify-content-between">
          <span>用户名: {{ member.userName }}</span>
          <span>ID: {{ member.id }}</span>
        </div>
        <span class="text-lg-start mt-2">邮箱: {{ member.email }}</span>
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
    isActive: Boolean,
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
.little-green-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #96f106;
}

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

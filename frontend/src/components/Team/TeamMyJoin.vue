<template>
  <div>
    <div class="function-button">
      <div>
        <h2>{{ $route.query.teamName }}</h2>
        <small>ID:{{ teamID }}</small>
      </div>
      <b-dropdown variant="link" right>
        <template #button-content>
          <b-icon icon="justify"></b-icon>
        </template>
        <invite-team-member></invite-team-member>
        <b-dropdown-item>新建会议室</b-dropdown-item>
        <leave-team></leave-team>
      </b-dropdown>
    </div>
    <b-tabs>
      <b-tab title="团队成员列表">
        <b-list-group>
          <b-list-group-item v-for="member in members" :key="member.userID">
            <b-avatar variant="success" icon="person"></b-avatar>
            <span>{{ member.userName }}</span>
          </b-list-group-item>
        </b-list-group>
      </b-tab>
      <meeting-room-list></meeting-room-list>
    </b-tabs>
  </div>
</template>
<script>
import InviteTeamMember from '../../components/Team/InviteTeamMember'
import MeetingRoomList from '../Team/MeetingRoomList.vue'
import LeaveTeam from '../../components/Team/LeaveTeam'
import { mapState } from 'vuex'
export default {
  name: 'TeamMyBuild',
  data: function () {
    return {
      teamName: '指尖宇宙',
      members: [
        {
          userID: 111,
          userName: 'John'
        },
        {
          userID: 123,
          userName: 'Tom'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      teamID: (state) => state.Team.teamID
    })
  },
  components: {
    MeetingRoomList,
    InviteTeamMember,
    LeaveTeam
  }
}
</script>
<style scoped>
.function-button {
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-bottom: 20px;
}
</style>

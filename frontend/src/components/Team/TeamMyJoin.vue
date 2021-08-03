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
      <team-member-list></team-member-list>
      <conference-list></conference-list>
    </b-tabs>
  </div>
</template>
<script>
import InviteTeamMember from '../../components/Team/InviteTeamMember'
import ConferenceList from '../Team/ConferenceList.vue'
import LeaveTeam from '../../components/Team/LeaveTeam'
import TeamMemberList from '../../components/Team/TeamMemberList'
import { mapState } from 'vuex'
export default {
  name: 'TeamMyBuild',
  data: function () {
    return {
      teamName: '指尖宇宙',
      members: []
    }
  },
  computed: {
    ...mapState({
      teamID: (state) => state.Team.teamID
    })
  },
  components: {
    ConferenceList,
    InviteTeamMember,
    LeaveTeam,
    TeamMemberList
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

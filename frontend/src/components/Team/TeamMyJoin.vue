<template>
  <div>
    <create-new-conference></create-new-conference>
    <invite-member inviteType='inviteTeamMember'></invite-member>
    <div class="function-button">
      <div>
        <h2>{{ $route.query.teamName }}</h2>
        <small>ID:{{ teamID }}</small>
      </div>
      <b-dropdown variant="link" right>
        <template #button-content>
          <b-icon icon="justify"></b-icon>
        </template>
        <b-dropdown-item v-b-modal.inviteTeamMember>邀请新成员</b-dropdown-item>
        <b-dropdown-item v-b-modal.create-new-conference>新建会议室</b-dropdown-item>
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
import InviteMember from '../../components/Team/InviteMember'
import ConferenceList from '../Team/ConferenceList.vue'
import LeaveTeam from '../../components/Team/LeaveTeam'
import TeamMemberList from '../../components/Team/TeamMemberList'
import CreateNewConference from './CreateNewConference.vue'
import { mapState } from 'vuex'
export default {
  name: 'TeamMyCreate',
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
    TeamMemberList,
    InviteMember,
    LeaveTeam,
    CreateNewConference
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

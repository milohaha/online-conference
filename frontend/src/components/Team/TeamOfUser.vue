<template>
  <div>
    <create-new-conference></create-new-conference>
    <invite-member inviteType='inviteTeamMember'></invite-member>
    <div class="function-button">
      <div>
        <h2>{{ teamName }}</h2>
        <small>ID:{{ teamID }}</small>
      </div>
      <b-dropdown variant="link" right>
        <template #button-content>
          <b-icon icon="justify"></b-icon>
        </template>
        <b-dropdown-item v-b-modal.inviteTeamMember>邀请新成员</b-dropdown-item>
        <b-dropdown-item v-b-modal.create-new-conference>新建会议室</b-dropdown-item>
        <b-dropdown-item v-if="isFounder">解散团队</b-dropdown-item>
        <leave-team v-if="!isFounder"></leave-team>
      </b-dropdown>
    </div>
    <b-tabs>
      <team-member-list :FounderID="founderID"></team-member-list>
      <conference-list></conference-list>
    </b-tabs>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import InviteMember from '../../components/Team/InviteMember'
import ConferenceList from '../Team/ConferenceList'
import CreateNewConference from '../Team/CreateNewConference.vue'
import TeamMemberList from '../Team/TeamMemberList'
import LeaveTeam from '../../components/Team/LeaveTeam'
export default {
  name: 'TeamOfUser',
  data: function () {
    return {
      teamName: '',
      founderID: '',
      isFounder: 0
    }
  },
  mounted () {
    this.getTeamName()
    this.getFounderID()
  },
  computed: {
    ...mapState({
      teamID: (state) => state.Team.teamID,
      userID: (state) => state.Login.userID
    })
  },
  methods: {
    getTeamName () {
      this.$store.dispatch('getObjects', {
        model: 'Team',
        condition: { id: this.teamID }
      })
        .then(response => {
          this.teamName = response.data.objects[0].teamName
        })
    },
    getFounderID () {
      this.$store.dispatch('getObjects', {
        model: 'Team',
        condition: { id: this.teamID }
      })
        .then(Response => {
          this.founderID = Number(Response.data.objects[0].founderID)
        })
      this.isFounder = (this.founderID === this.userID)
    }
  },
  components: {
    InviteMember,
    ConferenceList,
    CreateNewConference,
    TeamMemberList,
    LeaveTeam
  }
}
</script>
<style scoped>
.member-item {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

button {
  border-style: none;
  border-radius: 4px;
  background-color: #3c465d;
  color: #e9e8d4;
  line-height: 5px;
  padding: 0 8px;
}

.function-button {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>

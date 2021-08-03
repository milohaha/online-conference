<template>
  <div>
    <create-new-conference></create-new-conference>
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
        <b-dropdown-item v-b-modal.create-new-conference>新建会议室</b-dropdown-item>
        <b-dropdown-item>解散团队</b-dropdown-item>
      </b-dropdown>
    </div>
    <b-tabs>
      <team-member-list></team-member-list>
      <conference-list></conference-list>
    </b-tabs>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import InviteTeamMember from '../../components/Team/InviteTeamMember'
import ConferenceList from '../Team/ConferenceList'
import CreateNewConference from '../Team/CreateNewConference.vue'
import TeamMemberList from '../Team/TeamMemberList'
export default {
  name: 'TeamMyCreate',
  data: function () {
    return {
      teamName: ''
    }
  },
  mounted () {
    this.getTeamName()
  },
  computed: {
    ...mapState({
      teamID: (state) => state.Team.teamID
    })
  },
  methods: {
    getTeamName () {
      this.$store.dispatch('getObjects', {
        model: 'Team',
        condition: { teamID: this.teamID }
      })
        .then(response => {
          this.teamName = response.data.objects[0].teamName
        })
    }
  },
  components: {
    InviteTeamMember,
    ConferenceList,
    CreateNewConference,
    TeamMemberList
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

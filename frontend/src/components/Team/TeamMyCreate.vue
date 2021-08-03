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
      <b-tab title="团队成员列表">
        <b-list-group>
          <b-list-group-item v-for="member in members" :key="member.userID" class="member-item">
            <div>
              <b-avatar variant="success" icon="person"></b-avatar>
              <span>{{ member.userName }}</span>
            </div>
            <button class="delete-member">移除</button>
          </b-list-group-item>
        </b-list-group>
      </b-tab>
      <conference-list></conference-list>
    </b-tabs>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import InviteTeamMember from '../../components/Team/InviteTeamMember'
import ConferenceList from '../Team/ConferenceList'
import CreateNewConference from '../Team/CreateNewConference.vue'
export default {
  name: 'TeamMyBuild',
  props: {
    teamName: String
  },
  computed: {
    ...mapState({
      teamID: (state) => state.Team.teamID
    })
  },
  data: function () {
    return {
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
  components: {
    InviteTeamMember,
    ConferenceList,
    CreateNewConference
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

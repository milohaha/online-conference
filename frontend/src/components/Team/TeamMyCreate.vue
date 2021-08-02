<template>
  <div>
    <create-new-meeting-room></create-new-meeting-room>
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
        <b-button @click="bvModal.show('create-new-meeting-room')">新建会议室</b-button>
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
      <meeting-room-list></meeting-room-list>
    </b-tabs>
  </div>
</template>
<script>
import InviteTeamMember from '../../components/Team/InviteTeamMember'
import MeetingRoomList from '../Team/MeetingRoomList.vue'
import CreateNewMeetingRoom from '../Team/CreateNewMeetingRoom.vue'
import { mapState } from 'vuex'
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
    MeetingRoomList,
    CreateNewMeetingRoom
  }
}
</script>
<style scoped>
.meetingroom-item,
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

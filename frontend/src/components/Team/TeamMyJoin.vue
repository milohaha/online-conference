<template>
  <div>
    <div class="function-button">
      <div>
        <h2>{{ teamName }}</h2>
        <small>ID:123456</small>
      </div>
      <b-dropdown variant="link" right>
        <template #button-content>
          <b-icon icon="justify"></b-icon>
        </template>
        <b-dropdown-item>邀请新成员</b-dropdown-item>
        <b-dropdown-item>新建会议室</b-dropdown-item>
        <b-dropdown-item>离开团队</b-dropdown-item>
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
import MeetingRoomList from '../Team/MeetingRoomList.vue'
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
  components: {
    MeetingRoomList
  }
}
</script>
<style scoped>
.meetingroom-item {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.enter-meetingroom {
  border-style: none;
  border-radius: 4px;
  background-color: #3c465d;
  color: #e9e8d4;
  line-height: 5px;
  padding: 5px 8px;
}

.function-button {
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-bottom: 20px;
}
</style>

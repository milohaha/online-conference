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
      <b-tab title="会议室列表">
        <b-list-group>
          <b-list-group-item v-for="meetingRoom in meetingRooms" :key="meetingRoom.ID" class="meetingroom-item">
            <div>
              <b-avatar variant="success" icon="tags"></b-avatar>
              <span>{{ meetingRoom.title }}</span>
            </div>
            <button>进入</button>
          </b-list-group-item>
        </b-list-group>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
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
      ],
      meetingRooms: [
        {
          ID: 123154,
          title: '讨论关于xx'
        },
        {
          ID: 45685,
          title: '讨论关于yy'
        }
      ]
    }
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

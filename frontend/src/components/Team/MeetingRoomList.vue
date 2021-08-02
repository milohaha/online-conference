<template>
  <b-tab title="会议室列表" @click="checkMeetingRoom">
    <b-list-group>
      <b-list-group-item v-for="meetingRoom in meetingRooms" :key="meetingRoom.id" class="meeting-rooms">
        <div>
          <b-avatar variant="success" icon="tags"></b-avatar>
          <span>{{ meetingRoom.conferenceName }}</span>
        </div>
        <button class="enter-meetingroom">进入</button>
      </b-list-group-item>
    </b-list-group>
    <div v-if="!hasMeetingRoom" class="no-meeting-room">
      <h5>当前团队暂无会议室</h5>
      <img src="../../assets/picture/list.png" alt="当前无会议">
    </div>
  </b-tab>
</template>
<script>
import { mapGetters } from 'vuex'
import Api from '../../api'
export default {
  name: 'MeetingRoomList',
  data: function () {
    return {
      hasMeetingRoom: true,
      meetingRooms: []
    }
  },
  computed: {
    ...mapGetters({
      teamID: 'teamID'
    })
  },
  methods: {
    checkMeetingRoom () {
      Api.checkMeetingRoom({
        model: 'Conference',
        condition: { teamID: this.teamID }
      }).then((response) => {
        this.meetingRooms = response.data.objects
        if (this.meetingRooms.length === 0) {
          this.hasMeetingRoom = false
        }
      })
    }
  }
}
</script>
<style scoped>
.enter-meetingroom {
  border-style: none;
  border-radius: 4px;
  background-color: #3c465d;
  color: #e9e8d4;
  line-height: 5px;
  padding: 5px 8px;
}

.meeting-rooms {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.no-meeting-room {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

img {
  margin-top: 20px;
  height: 350px;
}
</style>

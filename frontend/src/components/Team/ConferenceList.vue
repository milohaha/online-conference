<template>
  <b-tab title="会议室列表" @click="checkConference">
    <b-list-group>
      <b-list-group-item v-for="conference in conferences" :key="conference.id">
        <conference-in-list
          :conferenceName="conference.conferenceName"
          :conferenceID="conference.id"
        ></conference-in-list>
      </b-list-group-item>
    </b-list-group>
    <div v-if="!hasConference" class="no-conference">
      <h5>您尚未加入任何会议室</h5>
      <img src="../../assets/picture/list.png" alt="当前无会议">
    </div>
  </b-tab>
</template>
<script>
import { mapState } from 'vuex'
import Api from '../../api'
import ConferenceInList from './ConferenceInList.vue'
export default {
  name: 'ConferenceList',
  data: function () {
    return {
      hasConference: true,
      conferences: []
    }
  },
  computed: {
    ...mapState({
      teamID: (state) => state.Team.teamID,
      userID: (state) => state.Login.userID
    })
  },
  methods: {
    checkConference () {
      Api.checkConference({
        userID: this.userID,
        teamID: this.teamID
      }).then((response) => {
        this.conferences = response.data.conferences
        if (this.conferences.length === 0) {
          this.hasConference = false
        }
      })
    }
  },
  components: {
    ConferenceInList
  }
}
</script>
<style scoped>
.no-conference {
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

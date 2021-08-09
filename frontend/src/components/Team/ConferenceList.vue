<template>
  <b-card class="conference-list-card">
    <template #header>
      <b-link class="conference-list-link" @click="checkConference">
        <span>会议室列表</span>
      </b-link>
    </template>
    <b-list-group class="conference-list-group">
      <b-list-group-item
        button
        @click="enterConference(conference.id)"
        v-for="conference in conferences"
        :key="conference.id">
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
  </b-card>
</template>
<script>
import { mapState } from 'vuex'
import Api from '../../api'
import ConferenceInList from './ConferenceInList.vue'
export default {
  name: 'ConferenceList',
  data: function () {
    return {
      conferences: []
    }
  },
  created () {
    this.checkConference()
  },
  computed: {
    ...mapState({
      teamID: (state) => state.Team.teamID,
      userID: (state) => state.Login.userID,
      conferenceID: state => state.Team.conferenceID
    }),
    hasConference: function () {
      return this.conferences.length !== 0
    }
  },
  methods: {
    checkConference () {
      Api.checkConference({
        userID: this.userID,
        teamID: this.teamID
      }).then((response) => {
        this.conferences = response.data.conferences
      })
    },
    enterConference (conferenceID) {
      this.$store.commit('ENTER_CONFERENCE', conferenceID)
      this.$io.emit('enterConference',
        this.userID,
        this.conferenceID)
      this.$router.push({ path: '/conference', query: { conferenceID: conferenceID } })
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

.conference-list-card {
  border-radius: 5px;
  box-shadow: 1px 1px 5px #7f7f7f;
}

.conference-list-link {
  text-decoration: none;
}

.conference-list-group {
  overflow-y: scroll;
  max-height: 320px;
}
</style>

<template>
  <div class="conference">
    <div class="conference-content">
    <b-avatar variant="success" icon="tags"></b-avatar>
    <span class="conference-name">{{ conferenceName }}</span>
    </div>
    <button class="enter-conference-button" @click="enterConference">进入</button>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'ConferenceInList',
  props: {
    conferenceID: Number,
    conferenceName: String
  },
  computed: {
    ...mapState({
      userID: state => state.Login.userID
    })
  },
  methods: {
    enterConference () {
      this.$io.emit('enterConference',
        this.userID,
        this.conferenceID)
      this.$store.commit('ENTER_CONFERENCE', this.conferenceID)
      this.$router.push({ path: '/conference' })
    }
  }
}
</script>
<style scoped>
.conference {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.enter-conference-button {
  border-style: none;
  border-radius: 4px;
  background-color: #3c465d;
  color: #e9e8d4;
  line-height: 5px;
  padding: 5px 8px;
  height: 40px;
}

.conference-name {
  display: inline-block;
  max-width: 300px;
}

.conference-content {
  display: flex;
  align-items: center;
}
</style>

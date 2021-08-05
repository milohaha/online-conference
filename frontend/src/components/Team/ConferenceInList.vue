<template>
  <div class="conference">
    <div>
    <b-avatar variant="success" icon="tags"></b-avatar>
    <span>{{ conferenceName }}</span>
    </div>
    <button class="enter-conference-button" @click="enterConference">进入</button>
  </div>
</template>
<script>
export default {
  name: 'ConferenceInList',
  props: {
    conferenceID: Number,
    conferenceName: String
  },
  methods: {
    enterConference () {
      // TODO 向后端发送成员暂离会议室事件 以维护会议室在线成员列表
      this.$router.push({ path: '/conference', query: { conferenceID: this.conferenceID } })
    }
  }
}
</script>
<style scoped>
.conference {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.enter-conference-button {
  border-style: none;
  border-radius: 4px;
  background-color: #3c465d;
  color: #e9e8d4;
  line-height: 5px;
  padding: 5px 8px;
}
</style>

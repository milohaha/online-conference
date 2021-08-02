<template>
  <div>
    <button @click="enterTeam">{{ teamName }}</button>
  </div>
</template>
<script>
export default {
  name: 'TeamInList',
  props: {
    teamID: Number,
    teamName: String,
    type: String
  },
  methods: {
    enterTeam () {
      if (this.type === 'built') {
        this.enterTeamBulit()
      } else {
        this.enterTeamJoined()
      }
    },
    enterTeamJoined () {
      this.$store.commit('ENTER_TEAM', this.teamID)
      this.$router.push({ path: '/team/teammyjoin' })
    },
    enterTeamBulit () {
      this.$store.commit('ENTER_TEAM', this.teamID)
      this.$router.push({ path: '/team/teammybuild' })
    }
  }
}
</script>
<style scoped>
button {
  border-style: none;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  display: block;
}
</style>

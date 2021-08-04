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
    teamName: String
  },
  methods: {
    enterTeam () {
      this.$store.commit('ENTER_TEAM', this.teamID)
      this.$router.push({ path: '/team/teamofuser' })
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

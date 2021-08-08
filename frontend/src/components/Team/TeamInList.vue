<template>
  <b-card
    :title="teamName"
    img-src="https://picsum.photos/600/300/?image=25"
    img-alt="Image"
    img-top
    bg-variant="light"
    class="m-4 single-card">
    <b-card-text>
      <p>团队ID: {{ teamID }}</p>
      <p>一个团队，一个小天地</p>
    </b-card-text>
    <template #footer>
      <small>指尖宇宙</small>
    </template>
    <b-button @click="enterTeam" variant="primary">进入团队</b-button>
  </b-card>
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
.single-card {
  min-width: 16rem;
  max-width: 16rem;
  border-radius: 5px;
  box-shadow: 1px 1px 5px #7f7f7f;
}
</style>

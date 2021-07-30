<template>
<div id="teamJoin">
  <h2 id="title">加入团队</h2>
  <h6>团队id：</h6>
  <b-form-input v-model="teamId" id="getTeamId"></b-form-input>
  <b-button variant="outline-primary" id="joinTeamBtn">加入团队</b-button>
</div>
</template>
<script>
export default {
  data: function () {
    return {
      teamId: ''
    }
  }
}
</script>
<style scoped>
#teamJoin {
  margin: 0;
}
#title, #getTeamId {
  margin-bottom: 20px;
}
</style>

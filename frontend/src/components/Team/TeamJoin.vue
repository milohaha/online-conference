<template>
<div id="teamjoin">
  <h2 id="title">加入团队</h2>
  <h6>团队名称：</h6>
  <b-form-input v-model="teamname" id="getTeamname"></b-form-input>
  <b-button variant="outline-primary" id="joinTeamBtn">加入团队</b-button>
</div>
</template>
<script>
export default {
  data: function () {
    return {
      teamname: ''
    }
  }
}
</script>
<style scoped>
#teamjoin {
  margin-left: 50px;
}
#title, #getTeamname {
  margin-bottom: 20px;
}
</style>

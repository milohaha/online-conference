<template>
  <div id="teambulid">
    <h2 id="title">创建团队</h2>
    <h6>团队名称：</h6>
    <b-form-input v-model="teamname" id="getTeamname"></b-form-input>
    <b-button variant="outline-primary" id="createTeamBtn">创建团队</b-button>
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
#teambulid {
  margin: 0;
}
#title, #getTeamname{
  margin-bottom: 20px;
}
</style>

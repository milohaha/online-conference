<template>
  <div id="team-build">
    <b-jumbotron >
      <template #header>创建团队</template>

      <template #lead>
        一个响亮的团队名称是走向成功的开端
      </template>

      <hr class="my-3">

      <div role="group">
        <label>你团队的名称：</label>
        <b-form-input
          id="input-live"
          v-model="team.teamName"
          :state="nameState"
          aria-describedby="input-live-help input-live-feedback"
          placeholder="请输入团队名称"
          trim
        ></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback">
          最少输入4个字
        </b-form-invalid-feedback>
      </div>
      <b-button variant="outline-primary" id="create-team-button" @click="teamBuild">创建团队</b-button>
    </b-jumbotron>
  </div>
</template>
<script>
export default {
  computed: {
    nameState () {
      return this.team.teamName.length > 3
    }
  },
  data: function () {
    return {
      team: {
        teamName: ''
      }
    }
  },
  methods: {
    teamBuild () {
      this.axios.post(process.env.VUE_APP_API_BASE + '/team', this.team)
    }
  }
}
</script>
<style scoped>
#team-build {
  position: absolute;
  left: 400px;
}
#create-team-button{
  margin-top: 20px;
}
</style>

<template>
  <div id="team-build">
    <b-jumbotron >
      <template #header>创建团队</template>

      <template #lead>
        一个响亮的团队名称是走向成功的开端
      </template>

      <hr class="my-3">
      <b-alert
        :show="dismissCountDown"
        variant="warning"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="countDownChanged"
      >
        该名称已被注册！
      </b-alert>
      <b-modal id="bv-modal-example" ref="my-modal" hide-backdrop centered hide-footer>
        <template #modal-title>
          创建团队
        </template>
        <div class="d-block text-center">
          <h3>团队&quot;{{team.teamName}}&quot;创建成功</h3>
        </div>
        <div>
          <b-button
            block variant="success"
            style="margin-left:188px;margin-top: 10px"
            @click="$bvModal.hide('bv-modal-example')">
            点我关闭
          </b-button>
        </div>
      </b-modal>
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
import { mapActions } from 'vuex'
export default {
  computed: {
    ...mapActions({
      createTeam: 'createTeam'
    }),
    nameState () {
      return this.team.teamName.length > 3
    }
  },
  data: function () {
    return {
      team: {
        teamName: ''
      },
      dismissCountDown: 0
    }
  },
  methods: {
    teamBuild () {
      this.$store.dispatch('createTeam', this.team)
        .then(response => {
          if (response.data.message === 'created') {
            this.showModal()
          } else if (response.data.message === 'existed') {
            this.showAlert()
          }
        })
        .catch(error => console.log(error))
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = 5
    },
    showModal () {
      this.$refs['my-modal'].show()
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

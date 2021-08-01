<template>
  <div class="team-create">
    <b-jumbotron >
      <template #header>创建团队</template>

      <template #lead>
        一个响亮的团队名称是走向成功的开端
      </template>

      <hr class="divider">
<b-alert
        :show="dismissCountDown"
        variant="warning"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="countDownChanged"
>
        该名称已被注册！
</b-alert>
      <b-modal id="bv-modal-create-team" ref="modal-create-team" hide-backdrop centered hide-footer>
        <template #modal-title>
          创建团队
        </template>
        <div class="d-block text-center create-team">
          <h3>团队&quot;{{team.teamName}}&quot;创建成功</h3>
        </div>
        <div>
          <b-button
            block variant="success"
            class="modal-close-button"
            @click="$bvModal.hide('bv-modal-create-team')">
            点我关闭
          </b-button>
        </div>
      </b-modal>
      <div role="group">
        <label>你团队的名称：</label>
        <b-form-input
          class="input-team-tame"
          v-model="team.teamName"
          :state="nameState"
          aria-describedby="input-team-name-help input-team-name-feedback"
          placeholder="请输入团队名称"
          trim
        ></b-form-input>
        <b-form-invalid-feedback id="input-team-name-feedback">
          最少输入4个字
        </b-form-invalid-feedback>
      </div>
      <b-button variant="outline-primary" class="create-team-button" @click="teamBuild">创建团队</b-button>
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
      dismissCountDown: 0,
      dismissTime: 3
    }
  },
  methods: {
    teamBuild () {
      this.$store.dispatch('createTeam', this.team)
        .then(response => {
          if (response.data.message === 'CREATED') {
            this.showModal()
          } else if (response.data.message === 'EXISTS') {
            this.showAlert()
          }
        })
        .catch(error => console.log(error))
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissTime
    },
    showModal () {
      this.$refs['modal-create-team'].show()
    }
  }
}
</script>
<style scoped>

.team-create {
  position: absolute;
  left: 400px;
}
.create-team-button{
  margin-top: 20px;
}
.modal-close-button{
  margin-left: 188px;
  margin-top: 10px;
}
</style>

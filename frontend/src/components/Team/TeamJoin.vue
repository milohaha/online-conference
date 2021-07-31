<template>
<div class="team-join">
  <h2 class="title">加入团队</h2>
<b-alert
    :show="dismissCountDown"
    variant="warning"
    @dismissed="dismissCountDown=0"
    @dismiss-count-down="countDownChanged"
>
  {{ alertMessage }}
</b-alert>
  <b-modal id="bv-modal-join-team" ref="modal-join-team" hide-backdrop centered hide-footer>
    <template #modal-title>
      加入团队
    </template>
    <div class="d-block text-center join-team">
      <h3>申请已发送，请等待通过</h3>
    </div>
    <div>
      <b-button
        block variant="success"
        class="modal-close-button"
        @click="$bvModal.hide('bv-modal-join-team')">
        点我关闭
      </b-button>
    </div>
  </b-modal>
  <h6>团队id：</h6>
  <b-form-input v-model="teamID" class="get-team-id"></b-form-input>
  <b-button variant="outline-primary" class="join-team-btn" @click="teamJoin">加入团队</b-button>
</div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data: function () {
    return {
      teamID: '',
      dismissCountDown: 0,
      dismissTime: 5,
      alertMessage: ''
    }
  },
  computed: {
    ...mapActions({
      joinTeam: 'joinTeam'
    })
  },
  methods: {
    teamJoin () {
      this.$store.dispatch('joinTeam', {
        teamID: parseInt(this.teamID)
      })
        .then(response => {
          if (response.data.message === 'NOT_JOINED') {
            this.showModal()
          } else if (response.data.message === 'NOT_EXIST ') {
            this.alertMessage = '查询不到团队ID'
            this.showAlert()
          } else if (response.data.message === 'HAS_JOINED') {
            this.alertMessage = '您已加入该团队'
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
      this.$refs['modal-join-team'].show()
    }
  }
}
</script>
<style scoped>
.team-join {
  margin: 0;
}
.title,
.get-team-id {
  margin-bottom: 20px;
}
.modal-close-button{
  margin-left: 188px;
  margin-top: 10px;
}
</style>

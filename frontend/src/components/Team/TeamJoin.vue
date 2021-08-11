<template>
<div class="team-join">
  <b-modal
    id="bv-modal-join-team"
    hide-footer
    backdrop
    no-stacking
    centered>
    <template #modal-title>加入团队</template>
    <b-alert
      :show="dismissCountDown"
      variant="warning"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged">
      {{ alertMessage }}
    </b-alert>
    <h4>团队id：</h4>
    <b-form-input
      v-model="teamID"
      class="get-team-id"
      :state="validationTeamID"
      required>
    </b-form-input>
    <b-form-invalid-feedback :state="validationTeamID">
      团队ID为数字
    </b-form-invalid-feedback>
    <div class="d-flex align-items-center justify-content-center">
      <b-button variant="outline-primary" class="join-team-btn" @click="teamJoin">加入团队</b-button>
    </div>
  </b-modal>
  <b-modal
    id="bv-modal-join-team-notice"
    backdrop
    centered
    hide-footer>
    <template #modal-title>
      加入团队
    </template>
    <div class="d-block text-center join-team">
      <h3>申请已发送，请等待通过</h3>
    </div>
    <div>
      <b-button
        block variant="outline-success"
        class="modal-close-button"
        @click="$bvModal.hide('bv-modal-join-team-notice')">
        点我关闭
      </b-button>
    </div>
  </b-modal>
</div>
</template>
<script>
import { mapState } from 'vuex'
import Api from '../../api'
export default {
  data: function () {
    return {
      teamID: '',
      dismissCountDown: 0,
      dismissTime: 5,
      alertMessage: '',
      founderID: []
    }
  },
  computed: {
    ...mapState({
      userID: (state) => state.Login.userID
    }),
    validationTeamID () {
      const reg = /^\d+$/
      return !!reg.exec(this.teamID)
    }
  },
  methods: {
    teamJoin () {
      if (this.validationTeamID) {
        Api.joinTeam({
          teamID: Number(this.teamID)
        })
          .then(outerResponse => {
            if (outerResponse.data.message === 'NOT_JOINED') {
              this.showModal()
              Api.getObjects({
                model: 'Team',
                condition: { id: Number(this.teamID) }
              })
                .then(innerResponse => {
                  this.founderID.push(Number(innerResponse.data.objects[0].founderID))
                }).then(() => {
                  this.$io.emit('sendVerification',
                    this.userID,
                    this.founderID,
                    Number(this.teamID),
                    'application')
                })
            } else if (outerResponse.data.message === 'NOT_EXIST') {
              this.alertMessage = '查询不到团队ID'
              this.showAlert()
            } else if (outerResponse.data.message === 'HAS_JOINED') {
              this.alertMessage = '您已加入该团队'
              this.showAlert()
            }
          })
          .catch(error => console.log(error))
      }
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissTime
    },
    showModal () {
      this.$bvModal.show('bv-modal-join-team-notice')
    }
  }
}
</script>
<style scoped>
.team-join {
  margin: 0;
}

.get-team-id {
  margin-bottom: 20px;
}

.modal-close-button {
  margin-left: 188px;
  margin-top: 10px;
}
</style>

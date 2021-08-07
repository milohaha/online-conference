<template>
  <div class="team-create">
    <b-modal
    id="bv-modal-create-team"
    hide-backdrop
    centered
    hide-footer
    no-stacking
    no-close-on-backdrop>
      <template #modal-title>创建团队</template>
      <b-jumbotron>
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
        <div role="group">
          <label>你团队的名称：</label>
          <b-form-input
            class="input-team-tame"
            v-model="team.groupName"
            :state="validationGroupName"
            aria-describedby="input-team-name-help input-team-name-feedback"
            placeholder="请输入团队名称"
            ref="inputgroupName"
            trim
          ></b-form-input>
          <b-form-invalid-feedback id="input-team-name-feedback">
            最少输入5个字
          </b-form-invalid-feedback>
        </div>
        <b-button
          variant="outline-primary"
          class="create-team-button"
          @click="teamCreate">
          创建团队
        </b-button>
      </b-jumbotron>
    </b-modal>
    <b-modal
      id="bv-modal-create-team-notice"
      hide-backdrop
      centered
      hide-footer>
      <template #modal-title>
        创建团队
      </template>
      <div class="d-block text-center">
        <h3>团队&quot;{{team.groupName}}&quot;创建成功</h3>
      </div>
      <div>
        <b-button
          block variant="success"
          class="modal-close-button"
          @click="$bvModal.hide('bv-modal-create-team-notice')">
          点我关闭
        </b-button>
      </div>
    </b-modal>
  </div>
</template>
<script>
import Api from '../../api'
export default {
  computed: {
    validationGroupName () {
      return this.team.groupName.length > 4
    }
  },
  data: function () {
    return {
      team: {
        groupName: ''
      },
      dismissCountDown: 0,
      dismissTime: 3
    }
  },
  methods: {
    teamCreate () {
      if (this.validationGroupName) {
        Api.createGroup(this.team)
          .then(response => {
            if (response.data.message === 'CREATED') {
              this.showModal()
            } else if (response.data.message === 'EXISTS') {
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
      this.$bvModal.show('bv-modal-create-team-notice')
    }
  }
}
</script>
<style scoped>

.team-create {
  position: absolute;
  left: 400px;
}

.create-team-button {
  margin-top: 20px;
}

.modal-close-button {
  margin-left: 188px;
  margin-top: 10px;
}
</style>

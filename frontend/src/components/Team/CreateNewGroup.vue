<template>
  <div>
    <b-modal
      id="create-new-group"
      :title="title"
      button-size="sm"
      no-stacking
      centered>
      <template #modal-footer>
        <b-button @click="checkInput" variant="outline-success">确定</b-button>
        <b-button
          @click="$bvModal.hide('create-new-group')"
          variant="outline-warning">
          取消
        </b-button>
      </template>
      <div class="create-new-group-content">
        <b-form-input
          class="get-group-name"
          placeholder="请输入名称"
          v-model="inputName"
          :state='nameState'
          aria-describedby="wrong-feedback">
        </b-form-input>
        <b-form-invalid-feedback :state="nameState" id='wrong-feedback'>
          请输入4-10字的名称
        </b-form-invalid-feedback>
        <img
          src="../../assets/picture/conference.png"
          alt="conference"
          v-if="groupType === 'Conference'">
        <img
          src="../../assets/picture/team.png"
          alt="team"
          v-if="groupType === 'Team'">
      </div>
    </b-modal>
    <b-modal
      id="create-result-notice"
      ok-only
      centered>
      <template #modal-header>
        {{ title }}
      </template>
      <div class="text-center">
        <h4 :class="'text-' + noticeStyle">{{ notice }}</h4>
      </div>
      <template #modal-footer>
        <b-button
          @click="showInvitingMember"
          variant="outline-success">
          确定
        </b-button>
      </template>
    </b-modal>
    <invite-member
      :inviteType="inviteType"
      :groupID="groupID"
      v-if="createResult === 'CREATED'"
      @inviteSuccess="createResult = ''">
    </invite-member>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import InviteMember from './InviteNewMember.vue'
import Api from '../../api'
export default {
  props: {
    groupType: String
  },
  data: function () {
    return {
      groupName: '',
      inputName: '',
      notice: '',
      noticeStyle: '',
      createResult: '',
      groupID: ''
    }
  },
  computed: {
    title () {
      return this.groupType === 'Team' ? '创建团队' : '新建会议室'
    },
    groupInfo () {
      return this.groupType === 'Team'
        ? { groupName: this.inputName }
        : { groupName: this.inputName, teamID: this.teamID }
    },
    nameState () {
      return this.inputName.length > 3 && this.inputName.length < 11
    },
    inviteType () {
      return this.groupType === 'Team' ? 'invite-team-member' : 'invite-conference-member'
    },
    ...mapState({
      userID: (state) => state.Login.userID,
      teamID: (state) => state.Team.teamID
    })
  },
  methods: {
    showInvitingMember () {
      this.$bvModal.hide('create-result-notice')
      if (this.createResult === 'CREATED') {
        this.$bvModal.show(this.inviteType)
      }
    },
    checkInput () {
      if (this.nameState) {
        this.$bvModal.hide('create-new-group')
        Api.createGroup(this.groupInfo)
          .then((response) => {
            const result = response.data.message
            if (result === 'CREATED') {
              this.notice = '创建成功'
              this.groupID = response.data.id
              this.createResult = result
              this.$emit('createSuccess')
              this.noticeStyle = 'success'
            } else if (response.data.message === 'EXISTS') {
              this.notice = '创建失败，该名称已存在'
              this.noticeStyle = 'danger'
              this.createResult = ''
            } else {
              this.notice = '创建失败，请稍后再尝试'
              this.noticeStyle = 'warning'
              this.createResult = ''
            }
          }).then(() => {
            this.groupName = this.inputName
            this.inputName = ''
            this.$bvModal.show('create-result-notice')
          })
          .catch((error) => console.log(error))
      }
    }
  },
  components: {
    InviteMember
  }
}
</script>
<style scoped>
.get-group-name {
  margin-top: 20px;
}

img {
  margin-top: 10px;
  width: 350px;
  align-self: center;
}

.create-new-group-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>

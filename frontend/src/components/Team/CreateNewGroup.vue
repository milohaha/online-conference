<template>
  <div>
    <b-modal id="create-new-group"
             :title="title"
             button-size="sm"
             no-stacking>
      <template #modal-footer>
        <b-button @click="checkInput">确定</b-button>
        <b-button @click="$bvModal.hide('create-new-group')">取消</b-button>
      </template>
      <div class="create-new-group-content">
        <b-form-input class="get-group-name"
                      v-model="inputName"
                      placeholder="请输入名称"
                      :state='nameState'
                      aria-describedby="wrong-feedback">
        </b-form-input>
        <b-form-invalid-feedback id='wrong-feedback'>
          请输入名称
        </b-form-invalid-feedback>
        <img
          src="../../assets/picture/conference.png"
          alt="conference"
          v-if="groupType === 'Conference'"
        >
        <img
          src="../../assets/picture/team.png"
          alt="team"
          v-if="groupType === 'Team'"
        >
      </div>
    </b-modal>
    <b-modal id="create-result-notice"
             ok-only>
      <div class="text-center">
        <p>{{ notice }}</p>
      </div>
      <template #modal-footer>
        <b-button @click="showInvitingMember">确定</b-button>
      </template>
    </b-modal>
    <invite-member
      :inviteType="inviteType"
      :conferenceName="groupName"
    >
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
      createResult: ''
    }
  },
  computed: {
    title () {
      return this.groupType === 'Team' ? '创建团队' : '新建会议室'
    },
    groupInfo () {
      return this.groupType === 'Team' ? { groupName: this.inputName } : { groupName: this.inputName, teamID: this.teamID }
    },
    nameState () {
      return this.inputName.length > 0
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
            this.createResult = response.data.message
            if (this.createResult === 'CREATED') {
              this.notice = '创建成功'
            } else if (this.createResult === 'EXISTS') {
              this.notice = '创建失败，该名称已存在'
            } else {
              this.notice = '创建失败，请稍后再尝试'
            }
          })
        this.$bvModal.show('create-result-notice')
        this.groupName = this.inputName
        this.inputName = ''
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
  width: 350px;
  align-self: center;
}

.create-new-group-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>

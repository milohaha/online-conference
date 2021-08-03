<template>
  <div>
    <b-modal
      id="create-new-conference"
      title="新建会议室"
      button-size="sm"
      no-stacking
    >
      <template #modal-footer>
        <b-button @click="checkInput">确定</b-button>
        <b-button @click="$bvModal.hide('create-new-conference')">取消</b-button>
      </template>
      <div class="create-new-conference-content">
        <b-form-input
          class="get-conference-name"
          v-model="conferenceName"
          placeholder="输入会议室名称"
          :state='nameState'
          aria-describedby="wrong-feedback"
        >
        </b-form-input>
        <b-form-invalid-feedback id='wrong-feedback'>
          请输入名称
        </b-form-invalid-feedback>
        <img src="../../assets/picture/conference.png" alt="conference">
      </div>
    </b-modal>
    <b-modal id="create-result-notice" ok-only>
      <div class="text-center">
        <p>{{ notice }}</p>
      </div>
      <template #modal-ok>确定</template>
    </b-modal>
    <invite-member
    inviteType="inviteConferenceMember"
    :conferenceName="conferenceName"
    @createResult='noticeResult'
    >
    </invite-member>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import InviteMember from './InviteMember.vue'
export default {
  data: function () {
    return {
      conferenceName: '',
      notice: ''
    }
  },
  computed: {
    nameState () {
      return this.conferenceName.length > 0
    },
    ...mapState({
      userID: (state) => state.Login.userID,
      teamID: (state) => state.Team.teamID
    })
  },
  methods: {
    noticeResult (result) {
      if (result === 'success') {
        this.notice = '创建成功'
      } else if (result === 'exist') {
        this.notice = '创建失败，该会议室已存在'
      } else {
        this.notice = '创建失败，请稍后再试'
      }
      this.$bvModal.show('create-result-notice')
      this.conferenceName = ''
    },
    checkInput () {
      if (this.nameState) {
        this.$bvModal.hide('create-new-conference')
        this.$bvModal.show('inviteConferenceMember')
      }
    }
  },
  components: {
    InviteMember
  }
}
</script>
<style scoped>
.get-conference-name {
  margin-top: 20px;
}
img {
  width: 350px;
  align-self: center;
}
.create-new-conference-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>

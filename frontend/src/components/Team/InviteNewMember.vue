<template>
  <div class="invite-member">
    <b-modal
      :id="inviteType"
      ref="my-modal-invite-member"
      scrollable
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close>
      <template #modal-title>
        {{ inviteInformation.inviteContent }}
      </template>
      <div class="d-block text-center member-to-invite">
        <b-list-group>
          <member-to-invite
            v-for="memberToInvite in membersToInvite"
            :key="memberToInvite.id"
            :memberToInvite="memberToInvite"
            @selectMember="selectMember">
          </member-to-invite>
        </b-list-group>
        <div class="no-member-img" v-if="membersToInvite.length === 0">
          <strong>好像没有人可以邀请欸</strong>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <b-button
          size="lg"
          pill
          v-if="membersToInvite.length !== 0"
          variant="outline-success"
          class="modal-invite-button mt-2 mx-2"
          @click="inviteCheck">
          确认
        </b-button>
        <b-button
          size="lg"
          pill
          v-if="membersToInvite.length !== 0"
          variant="outline-warning"
          class="modal-invite-button mt-2 mx-2"
          @click="cancelInviting">
          取消
        </b-button>
        <b-button
          size="lg"
          pill
          v-else
          variant="outline-success"
          class="mt-2"
          @click="cancelInviting">
          确定
        </b-button>
      </div>
    </b-modal>
    <b-modal
      :id="inviteInformation.confirmNoticeID"
      no-close-on-backdrop
      centered>
      <template #modal-title>
        {{ inviteInformation.inviteContent }}
      </template>
      <div class="d-block text-center member-to-invite">
        您确认要邀请这些成员吗？
      </div>
      <template #modal-footer>
        <b-button @click="inviteMember" variant="outline-success">
          确认
        </b-button>
        <b-button @click="cancelInvitingCheck" variant="outline-warning">
          取消
        </b-button>
      </template>
    </b-modal>
    <b-modal
      :id="inviteInformation.inviteResultNoticeID"
      no-close-on-backdrop
      centered>
      <div class="d-block text-center">
        邀请成功！
      </div>
      <template #modal-footer>
        <b-button @click="inviteMemberSuccess" variant="outline-success">
          确认
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Api from '../../api'
import MemberToInvite from './MemberToInvite.vue'
export default {
  props: {
    inviteType: String,
    groupID: Number
  },
  data () {
    return {
      membersToInvite: [],
      membersSelected: []
    }
  },
  computed: {
    ...mapState({
      userID: (state) => state.Login.userID
    }),
    inviteInformation: function () {
      return this.inviteType === 'invite-team-member'
        ? {
          inviteContent: '邀请成员加入团队',
          confirmNoticeID: 'invite-team-member-check',
          inviteResultNoticeID: 'invite-team-success',
          groupType: 'Team'
        } : {
          inviteContent: '邀请成员加入会议室',
          confirmNoticeID: 'invite-conference-member-check',
          inviteResultNoticeID: 'invite-conference-success',
          groupType: 'Conference'
        }
    },
    hasMemberToInvite: function () {
      return this.membersToInvite.length !== 0
    }
  },
  methods: {
    inviteCheck () {
      this.$bvModal.show(this.inviteInformation.confirmNoticeID)
    },
    cancelInviting () {
      this.$bvModal.hide(this.inviteType)
      this.membersSelected = []
    },
    cancelInvitingCheck () {
      this.$bvModal.hide(this.inviteInformation.confirmNoticeID)
    },
    getConferenceMemberToInvite () {
      Api.getMembers({
        groupID: this.teamID,
        groupType: 'Team',
        inGroup: true
      })
        .then(response => {
          this.membersToInvite = response.data.members
          this.membersToInvite.splice(this.membersToInvite.findIndex(member => {
            return member.id === this.userID
          }), 1)
        })
    },
    selectMember (memberID) {
      if (this.membersSelected.findIndex((memberSelected) => memberSelected === memberID) !== -1) {
        this.membersSelected.splice(this.membersSelected.findIndex((memberSelected) => {
          return memberSelected === memberID
        }), 1)
      } else {
        this.membersSelected.push(memberID)
      }
    },
    inviteTeamMember () {
      this.$io.emit('sendVerification',
        this.userID,
        this.membersSelected,
        this.groupID,
        'invitation')
    },
    inviteConferenceMember () {
      this.$store.dispatch('inviteConferenceMember', {
        conferenceID: this.groupID,
        memberIDs: this.membersSelected
      })
    },
    inviteMember () {
      this.inviteType === 'invite-team-member' ? this.inviteTeamMember() : this.inviteConferenceMember()
      this.$bvModal.hide(this.inviteInformation.confirmNoticeID)
      this.$bvModal.hide(this.inviteType)
      this.$bvModal.show(this.inviteInformation.inviteResultNoticeID)
    },
    inviteMemberSuccess () {
      this.$bvModal.hide(this.inviteType)
      this.$bvModal.hide(this.inviteInformation.confirmNoticeID)
      this.$bvModal.hide(this.inviteInformation.inviteResultNoticeID)
      this.membersSelected = []
      this.$emit('inviteSuccess')
    },
    getMemberToInvite () {
      Api.getMembers({
        groupID: this.groupID,
        inGroup: false,
        groupType: this.inviteInformation.groupType
      })
        .then(response => {
          this.membersToInvite = response.data.members
          const index = this.membersToInvite.findIndex(member => member.id === this.userID)
          if (index !== -1) {
            this.membersToInvite.splice(index, 1)
          }
        })
    }
  },
  components: {
    MemberToInvite
  },
  created: function () {
    this.getMemberToInvite()
  }
}
</script>
<style scoped>
.no-member-img {
  width: 466px;
  height: 278px;
  background-image: url("../../assets/picture/login.png");
  background-repeat: no-repeat;
  background-size: contain;
}
</style>

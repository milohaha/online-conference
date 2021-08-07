<template>
  <div class="invite-member">
    <b-modal
      :id="inviteType"
      ref="my-modal-invite-member"
      scrollable
      hide-backdrop
      centered
      hide-footer
      no-close-on-backdrop
      hide-header-close
    >
      <template #modal-title>
        {{ inviteInformation.inviteContent }}
      </template>
      <div class="d-block text-center member-to-invite">
        <b-list-group>
          <member-to-invite
            v-for="memberToInvite in membersToInvite"
            :key="memberToInvite.id"
            :memberToInvite="memberToInvite"
            @selectMember="selectMember"
          ></member-to-invite>
        </b-list-group>
      </div>
      <div class="d-flex justify-content-center">
        <b-button
          size="lg"
          pill
          variant="outline-success"
          class="modal-invite-button mt-2"
          @click="inviteCheck">
          确认
        </b-button>
        <b-button
          size="lg"
          pill
          variant="outline-success"
          class="modal-invite-button mt-2"
          @click="cancelInviting">
          取消
        </b-button>
      </div>
    </b-modal>
    <b-modal
      :id="inviteInformation.confirmNoticeID"
      ref="my-modal-invite-team-member-check"
      hide-backdrop
      centered
      hide-footer
      no-close-on-backdrop>
      <template #modal-title>
        {{ inviteInformation.inviteContent }}
      </template>
      <div class="d-block text-center member-to-invite">
        您确认要邀请这些成员吗？
      </div>
      <b-button @click="inviteMember">
        确认
      </b-button>
      <b-button @click="cancelInvitingCheck">
        取消
      </b-button>
    </b-modal>
    <b-modal
      :id="inviteInformation.inviteResultNoticeID"
      hide-backdrop
      centered
      hide-footer
      no-close-on-backdrop
    >
      <div class="d-block text-center">
        邀请成功！
      </div>
      <b-button @click="inviteMemberSuccess">
        确认
      </b-button>
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
    conferenceName: String
  },
  data () {
    return {
      membersToInvite: [],
      membersSelected: []
    }
  },
  computed: {
    ...mapState({
      userID: (state) => state.Login.userID,
      teamID: (state) => state.Team.teamID
    }),
    inviteInformation: function () {
      return this.inviteType === 'invite-team-member' ? {
        inviteContent: '邀请成员加入团队',
        confirmNoticeID: 'invite-team-member-check',
        inviteResultNoticeID: 'invite-team-success'
      } : {
        inviteContent: '请选择与会成员',
        confirmNoticeID: 'invite-conference-member-check',
        inviteResultNoticeID: 'invite-conference-success'
      }
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
    getTeamMemberToInvite () {
      Api.getMembers({
        groupID: this.teamID,
        groupType: 'Team',
        inGroup: false
      })
        .then(response => {
          this.membersToInvite = response.data.members
        })
    },
    getConferenceMemberToInvite () {
      Api.getMembers({
        groupID: this.teamID,
        groupType: 'Team',
        inGroup: true
      })
        .then(response => {
          this.membersToInvite = response.data.members
          this.membersToInvite.splice(this.membersToInvite.findIndex(member => member.id === this.userID), 1)
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
        this.teamID,
        'invitation')
    },
    inviteConferenceMember () {
      this.$store.dispatch('inviteConferenceMember', {
        conferenceName: this.conferenceName,
        memberIDs: this.membersSelected
      })
    },
    inviteMember () {
      this.inviteType === 'invite-team-member' ? this.inviteTeamMember() : this.inviteConferenceMember()
      this.$bvModal.show(this.inviteInformation.inviteResultNoticeID)
    },
    inviteMemberSuccess () {
      this.$bvModal.hide(this.inviteType)
      this.$bvModal.hide(this.inviteInformation.confirmNoticeID)
      this.$bvModal.hide(this.inviteInformation.inviteResultNoticeID)
      this.membersSelected = []
    }
  },
  components: {
    MemberToInvite
  },
  created: function () {
    return this.inviteType === 'invite-team-member' ? this.getTeamMemberToInvite() : this.getConferenceMemberToInvite()
  }
}
</script>

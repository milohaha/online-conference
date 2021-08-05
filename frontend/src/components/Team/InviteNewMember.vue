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
        {{ inviteContent }}
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
      :id="confirmNoticeID"
      ref="my-modal-invite-team-member-check"
      hide-backdrop
      centered
      hide-footer
      no-close-on-backdrop>
      <template #modal-title>
        {{ inviteContent }}
      </template>
      <div class="d-block text-center member-to-invite">
        您确认要邀请这些成员吗？
      </div>
      <b-button
        @click="inviteMember"
        v-b-modal.bv-modal-invite-member-notice>
        确认
      </b-button>
      <b-button @click="cancelInvitingCheck">
        取消
      </b-button>
    </b-modal>
    <b-modal
    id="bv-modal-invite-member-notice"
    hide-backdrop
    centered
    hide-footer
    no-close-on-backdrop>
      <template #modal-title>
        {{ inviteContent }}
      </template>
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
import { mapActions, mapState } from 'vuex'
import MemberToInvite from './MemberToInvite.vue'
export default {
  props: {
    inviteType: {
      String,
      default: 'invite-team-member'
    },
    conferenceName: {
      String,
      default: 'null'
    }
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
    ...mapActions({
      getMembers: 'getMembers'
    }),
    inviteContent: function () {
      return this.inviteType === 'invite-team-member' ? '邀请成员加入团队' : '请选择与会成员'
    },
    confirmNoticeID: function () {
      return this.inviteType === 'invite-team-member' ? 'invite-team-member-check' : 'invite-conference-member-check'
    }
  },
  methods: {
    inviteCheck () {
      this.$bvModal.show(this.confirmNoticeID)
    },
    cancelInviting () {
      this.$bvModal.hide(this.inviteType)
      this.membersSelected = []
    },
    cancelInvitingCheck () {
      this.$bvModal.hide(this.confirmNoticeID)
    },
    getTeamMemberToInvite () {
      this.$store.dispatch('getMembers', {
        groupID: this.teamID,
        groupType: 'Team',
        inGroup: false
      })
        .then(response => {
          this.membersToInvite = response.data.members
        })
    },
    getConferenceMemberToInvite () {
      this.$store.dispatch('getMembers', {
        groupID: this.teamID,
        groupType: 'Team',
        inGroup: true
      })
        .then(response => {
          this.membersToInvite = response.data.members
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
        teamID: this.teamID,
        memberIDs: this.membersSelected
      })
        .then((response) => {
          if (response.data.message === 'CREATED') {
            return this.$emit('createResult', 'success')
          } else {
            return this.$emit('createResult', 'exist')
          }
        })
        .catch(() => {
          return this.$emit('createResult', 'fail')
        })
    },
    inviteMember () {
      this.inviteType === 'invite-team-member' ? this.inviteTeamMember() : this.inviteConferenceMember()
    },
    inviteMemberSuccess () {
      this.$bvModal.hide(this.inviteType)
      this.$bvModal.hide(this.confirmNoticeID)
      this.$bvModal.hide('bv-modal-invite-member-notice')
      this.membersSelected.length = 0
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

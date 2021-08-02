<template>
  <div class="invite-team-member">
    <b-modal
      id="bv-modal-invite-team-member"
      ref="my-modal-invite-team-member"
      scrollable
      hide-backdrop
      centered
      hide-footer
      no-close-on-backdrop>
      <template #modal-title>
        邀请成员加入团队
      </template>
      <div class="d-block text-center member-to-invite">
        <b-list-group >
          <member-to-invite
            v-for="memberToInvite in membersToInvite"
            :key="memberToInvite.id"
            :member-to-invite="memberToInvite"
            @selectMember="selectMember"></member-to-invite>
        </b-list-group>
      </div>
      <div class="d-flex justify-content-center">
        <b-button
          size="lg"
          pill
          variant="outline-success"
          class="modal-invite-button mt-2"
          @click="inviteMember">
          确认
        </b-button>
      </div>
    </b-modal>
    <b-dropdown-item
      variant="outline-primary"
      class="join-team-button"
      @click="getMemberToInvite"
      v-b-modal.bv-modal-invite-team-member>
      邀请新成员
    </b-dropdown-item>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import MemberToInvite from './MemberToInvite.vue'
export default {
  data () {
    return {
      dismissCountDown: 0,
      dismissTime: 5,
      membersToInvite: [],
      membersSelected: []
    }
  },
  computed: {
    ...mapGetters({
      userID: 'userID',
      teamID: 'teamID'
    }),
    ...mapActions({
      getMembers: 'getMembers'
    })
  },
  methods: {
    getMemberToInvite () {
      this.$store.dispatch('getMembers', {
        groupID: this.teamID,
        groupType: 'Team',
        inGroup: false
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
    inviteMember () {
      this.$io.emit('sendVerification',
        this.userID,
        this.membersSelected,
        this.teamID,
        'invitation')
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissTime
    }
  },
  components: {
    MemberToInvite
  }
}
</script>

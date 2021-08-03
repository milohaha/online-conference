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
        <b-list-group>
          <member-to-invite
            v-for="memberToInvite in membersToInvite"
            :key="memberToInvite.id"
            :member-to-invite="memberToInvite"
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
          v-b-modal.bv-modal-invite-team-member-check>
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
    <b-modal
      id="bv-modal-invite-team-member-check"
      ref="my-modal-invite-team-member-check"
      hide-backdrop
      centered
      hide-footer
      no-close-on-backdrop>
      <template #modal-title>
        邀请成员加入团队
      </template>
      <div class="d-block text-center member-to-invite">
        您确认要邀请这些成员吗？
      </div>
      <b-button
        @click="inviteMember">
        确认
      </b-button>
      <b-button @click="$bvModal.hide('bv-modal-invite-team-member-check')">
        取消
      </b-button>
    </b-modal>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import MemberToInvite from './MemberToInvite.vue'
export default {
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
      this.$bvModal.hide('bv-modal-invite-team-member-check')
      this.$bvModal.hide('bv-modal-invite-team-member')
    }
  },
  components: {
    MemberToInvite
  }
}
</script>

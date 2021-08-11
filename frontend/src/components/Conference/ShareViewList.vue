<template>
  <b-modal
    class="modal fade"
    id="share-view"
    hide-header-close
    scrollable
    v-if="hasMemberToInvite"
  >
    <template #modal-header>
      <h4>请选择成员进行共享视角</h4>
    </template>
    <member-to-invite
      v-for="member in sortActiveMembers"
      :key="member.id"
      :memberToInvite="member"
      @selectMember="selectMember"
      :ref="member.id"
    ></member-to-invite>
    <template #modal-footer>
      <b-button @click="shareView" variant="light">确定</b-button>
      <b-button @click="cancelSharing" variant="light">取消</b-button>
    </template>
  </b-modal>
  <b-modal v-else id="share-view">
    暂时没有成员可以邀请
    <template #modal-footer>
      <b-button @click="cancelSharing">确定</b-button>
    </template>
  </b-modal>
</template>
<script>
import MemberToInvite from '../../components/Team/MemberToInvite.vue'
import Api from '../../api'
import PublicMethods from '../../methods/publicMethods'

export default {
  props: {
    conferenceID: Number,
    userID: Number,
    founderID: Number
  },
  data: function () {
    return {
      sortActiveMembers: [],
      isActive: false,
      isFounder: 0,
      memberSelected: 0,
      hasMemberToInvite: ''
    }
  },
  components: {
    MemberToInvite
  },
  methods: {
    shareView () {
      this.$emit('shareView', this.memberSelected)
      this.$bvModal.hide('share-view')
      this.memberSelected = 0
    },
    selectMember (selectID) {
      if (this.memberSelected !== 0) {
        this.$refs[this.memberSelected][0].isSelected = false
      }
      this.memberSelected = selectID
      this.$refs[selectID][0].isSelected = true
    },
    cancelSharing () {
      this.$bvModal.hide('share-view')
      this.selectID = 0
    },
    getActiveMembers () {
      Api.getActiveUsers({
        conferenceID: this.conferenceID
      })
        .then((response) => {
          const activeMembers = response.data.members
          this.sortActiveMembers = PublicMethods.methods.sortMemberByID(activeMembers, this.founderID)
          const index = this.sortActiveMembers.findIndex(member => member.id === this.userID)
          if (index !== -1) {
            this.sortActiveMembers.splice(index, 1)
          }
          this.hasMemberToInvite = this.sortActiveMembers.length !== 0
        })
    }
  },
  created () {
    this.getActiveMembers()
  }
}
</script>

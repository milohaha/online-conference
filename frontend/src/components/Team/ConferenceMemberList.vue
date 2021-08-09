<template>
  <div>
    <b-list-group>
      <div>
      <b-list-group-item
        v-for="activeMember in sortActiveMembers"
        :key="activeMember.id"
      >
        <member-item
          :member="activeMember"
          :founderID="founderID"
          @removeMember="removeActiveMember"
          :isActive="true"
        >
        </member-item>
      </b-list-group-item>
      </div>
      <div>
      <b-list-group-item
        v-for="member in sortMembers"
        :key="member.id"
        class="text-muted"
      >
        <member-item
          :member="member"
          :founderID="founderID"
          @removeMember="removeGroupMember"
        ></member-item>
      </b-list-group-item>
      </div>
    </b-list-group>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import MemberItem from './MemberItem.vue'
import Api from '../../api'
export default {
  data: function () {
    return {
      sortMembers: [],
      sortActiveMembers: [],
      founderID: '',
      groupID: ''
    }
  },
  computed: {
    ...mapState({
      teamID: (state) => state.Team.teamID,
      userID: (state) => state.Login.userID,
      conferenceID: (state) => state.Team.conferenceID
    })
  },
  created () {
    this.getGroupInformation()
  },
  methods: {
    removeActiveMember (userID) {
      // TODO 移除在线成员
    },
    removeGroupMember (userID) {
      this.sortMembers.splice(this.sortMembers.findIndex((member) => member.id === userID), 1)
    },
    getMembers () {
      Api.getMembers({
        groupID: this.groupID,
        groupType: 'Conference',
        inGroup: true
      }).then((response) => {
        this.members = response.data.members
        this.sortMembers = this.sortMemberByID(this.members, this.founderID)
        this.getActiveMembers()
      })
    },
    getActiveMembers () {
      Api.getActiveUsers({
        conferenceID: this.groupID
      }).then((response) => {
        const activeMembers = response.data.members
        this.sortActiveMembers = this.sortMemberByID(activeMembers, this.founderID)
        this.sortActiveMembers.forEach(activeMember => {
          const memberIndex = this.sortMembers.findIndex(member => member.id === activeMember.id)
          if (memberIndex !== -1) {
            this.sortMembers.splice(memberIndex, 1)
          }
        })
      })
    },
    getGroupInformation () {
      this.groupID = this.conferenceID
      Api.getObjects({
        model: 'Conference',
        condition: { id: this.groupID }
      })
        .then(response => {
          this.founderID = response.data.objects[0].founderID
          this.getMembers()
        })
    },
    sortMemberByID (members, founderID) {
      return members.sort(function (a, b) {
        if (a.id === founderID) {
          return -1
        }
        if (b.id === founderID) {
          return 1
        }
        if (a.id < b.id) {
          return -1
        }
        return a.id > b.id ? 1 : 0
      })
    }
  },
  components: {
    MemberItem
  }
}
</script>

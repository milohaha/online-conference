<template>
  <div>
    <b-card class="member-list-card">
      <template #header>
        <b-link class="member-list-link" @click="getMembers">
          <span>团队成员列表</span>
        </b-link>
      </template>
      <b-list-group class="member-list-group">
        <b-list-group-item
          v-for="member in sortMembers"
          :key="member.id"
        >
          <member-item
            :member="member"
            :founderID="founderID"
            @removeMember="removeMember"
          ></member-item>
        </b-list-group-item>
      </b-list-group>
    </b-card>
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
    removeMember (userID) {
      this.sortMembers.splice(this.sortMembers.findIndex((member) => member.id === userID), 1)
      this.$io.emit('leaveNotice',
        userID,
        this.$constant.REMOVED,
        this.$constant.IS_TEAM,
        this.teamID)
    },
    getMembers () {
      Api.getMembers({
        groupID: this.groupID,
        groupType: 'Team',
        inGroup: true
      }).then((response) => {
        this.members = response.data.members
        this.sortMembers = this.sortMemberByID(this.members, this.founderID)
      })
    },
    getGroupInformation () {
      this.groupID = this.teamID
      Api.getObjects({
        model: 'Team',
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
<style scoped>
.member-list-card {
  border-radius: 5px;
  box-shadow: 1px 1px 5px #7f7f7f;
}

.member-list-link {
  text-decoration: none;
}

.member-list-group {
  overflow-y: scroll;
  max-height: 300px;
}
</style>

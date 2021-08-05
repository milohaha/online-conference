<template>
<div>
    <b-list-group>
      <b-list-group-item
        v-for="member in sortMembers"
        :key="member.userID"
        class="member-item d-flex justify-content-around align-items-center h-auto">
        <b-avatar
          class="mr-0"
          variant="primary"
          icon="people-fill"
          size="3rem"></b-avatar>
        <div class="flex-column justify-content-start flex-grow-1">
          <p class="text-lg-start m-0">UserName: {{ member.userName }}</p>
          <p class="text-lg-start m-0" v-if="groupType === 'Team'">id: {{ member.id }}</p>
          <p class="text-lg-start m-0" v-if="groupType === 'Team'">email: {{ member.email }}</p>
        </div>
        <remove-team-member
          :userID="member.id"
          :modalID="member.userName"
          v-if="userID === founderID && member.id !== founderID"
          @removeTeamMember="removeTeamMember"></remove-team-member>
      </b-list-group-item>
    </b-list-group>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import RemoveTeamMember from '../../components/Team/RemoveTeamMember'
export default {
  props: {
    groupType: String
  },
  data: function () {
    return {
      sortMembers: [],
      founderID: '',
      conferenceID: '',
      groupID: ''
    }
  },
  computed: {
    ...mapState({
      teamID: (state) => state.Team.teamID,
      userID: (state) => state.Login.userID
    })
  },
  async created () {
    await this.getGroupInformation()
    await this.getMembers()
  },
  methods: {
    removeTeamMember (userID) {
      this.members.splice(this.members.findIndex((member) => member.id === userID), 1)
    },
    async getMembers () {
      await this.$store.dispatch('getMembers', {
        groupID: this.groupID,
        groupType: this.groupType,
        inGroup: true
      }).then((response) => {
        this.members = response.data.members
        this.sortMembers = this.sortMemberByID(this.members, this.founderID)
      })
    },
    async getGroupInformation () {
      this.conferenceID = this.$route.query.conferenceID
      await this.$store.dispatch('getObjects', {
        model: 'Conference',
        condition: { id: this.conferenceID }
      })
        .then(response => {
          this.founderID = response.data.objects[0].founderID
          this.groupID = this.groupType === 'Team' ? this.teamID : this.conferenceID
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
    RemoveTeamMember
  }
}
</script>

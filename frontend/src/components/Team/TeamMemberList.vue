<template>
  <b-tab title="团队成员列表">
    <b-list-group>
      <b-list-group-item
        v-for="member in sortMembers"
        :key="member.userID"
        class="member-item d-flex justify-content-around align-items-center">
        <b-avatar
          variant="primary"
          icon="people-fill"
          size="6rem"></b-avatar>
        <div class="flex-column justify-content-start flex-grow-1">
          <p class="text-lg-start">UserName: {{ member.userName }}</p>
          <p class="text-lg-start">id: {{ member.id }}</p>
          <p class="text-lg-start">email: {{ member.email }}</p>
        </div>
        <remove-team-member
          :userID="member.id"
          :modalID="member.userName"
          v-if="userID === founderID && member.id !== founderID"
          @removeTeamMember="removeTeamMember"></remove-team-member>
      </b-list-group-item>
    </b-list-group>
  </b-tab>
</template>
<script>
import { mapState } from 'vuex'
import RemoveTeamMember from '../../components/Team/RemoveTeamMember'
export default {
  data () {
    return {
      members: [],
      founderID: 0
    }
  },
  computed: {
    ...mapState({
      teamID: (state) => state.Team.teamID,
      userID: (state) => state.Login.userID
    }),
    sortMembers: function () {
      return this.sortMemberByID(this.members, this.founderID)
    }
  },
  mounted () {
    this.getMembers()
    this.getFounderID()
  },
  methods: {
    removeTeamMember (userID) {
      this.members.splice(this.members.findIndex((member) => member.id === userID), 1)
    },
    getFounderID () {
      this.$store.dispatch('getObjects', {
        model: 'Team',
        condition: { id: this.teamID }
      })
        .then(Response => {
          this.founderID = Number(Response.data.objects[0].founderID)
        })
    },
    getMembers () {
      this.$store.dispatch('getMembers', {
        groupID: this.teamID,
        groupType: 'Team',
        inGroup: true
      })
        .then(response => {
          this.members = response.data.members
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

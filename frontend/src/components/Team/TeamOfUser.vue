<template>
  <div>
    <create-new-group groupType="Conference"></create-new-group>
    <dismiss-group
      type="Team"
      v-if="isFounder"></dismiss-group>
    <leave-group  type="Team" v-else></leave-group>
    <invite-new-member inviteType='invite-team-member'></invite-new-member>
    <div class="function-button">
      <div>
        <h2>{{ teamName }}</h2>
        <small>ID:{{ teamID }}</small>
      </div>
      <b-dropdown variant="link" right>
        <template #button-content>
          <b-icon icon="justify"></b-icon>
        </template>
        <b-dropdown-item v-b-modal.invite-team-member>邀请新成员</b-dropdown-item>
        <b-dropdown-item v-b-modal.create-new-group>新建会议室</b-dropdown-item>
        <b-dropdown-item
          v-b-modal.bv-modal-dismiss-group
          v-show="isFounder">
          解散团队
        </b-dropdown-item>
        <b-dropdown-item
          v-b-modal.bv-modal-leave-group
          v-show="!isFounder">
          离开团队
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <b-tabs>
      <b-tab title="团队成员列表">
        <member-list :founderID="founderID" groupType="Team"></member-list>
      </b-tab>
      <conference-list></conference-list>
    </b-tabs>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import InviteNewMember from './InviteNewMember'
import ConferenceList from '../Team/ConferenceList'
import CreateNewGroup from '../Team/CreateNewGroup.vue'
import MemberList from '../Team/MemberList'
import DismissGroup from '../Team/DismissGroup'
import LeaveGroup from './LeaveGroup'
export default {
  name: 'TeamOfUser',
  data: function () {
    return {
      teamName: '',
      founderID: 0,
      isFounder: false
    }
  },
  mounted () {
    this.getTeamInfo()
  },
  computed: {
    ...mapState({
      teamID: (state) => state.Team.teamID,
      userID: (state) => state.Login.userID
    })
  },
  methods: {
    getTeamInfo () {
      this.$store.dispatch('getObjects', {
        model: 'Team',
        condition: { id: this.teamID }
      })
        .then(response => {
          this.teamName = response.data.objects[0].teamName
          this.founderID = Number(response.data.objects[0].founderID)
          this.isFounder = (this.founderID === this.userID)
        })
    }
  },
  components: {
    InviteNewMember,
    ConferenceList,
    CreateNewGroup,
    MemberList,
    DismissGroup,
    LeaveGroup
  }
}
</script>
<style scoped>
button {
  border-style: none;
  border-radius: 4px;
  background-color: #3c465d;
  color: #e9e8d4;
  line-height: 5px;
  padding: 0 8px;
}

.function-button {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>

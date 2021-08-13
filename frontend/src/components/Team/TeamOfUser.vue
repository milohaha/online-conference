<template>
  <div class="single-team d-flex">
    <dismiss-group :type="$constant.IS_TEAM" :groupID="teamID" v-if="isFounder"></dismiss-group>
    <leave-group  :type="$constant.IS_TEAM" :groupID="teamID" v-else></leave-group>
    <create-new-group groupType="Conference" @createSuccess="createConferenceSuccess"></create-new-group>
    <invite-new-member
      inviteType='invite-team-member'
      :groupID="teamID"
      v-if="isInviting"
      @inviteSuccess="isInviting = false"
      @noOneToInvite="isInviting = false">
    </invite-new-member>
    <div class="team-info-area mx-3">
      <b-card
        no-body
        class="team-info-card mx-4"
        img-src="https://placekitten.com/380/200"
        img-alt="Image"
        img-top>
        <template #header>
          <h4 class="mb-1">{{ teamName }}</h4>
        </template>

        <b-card-body>
          <b-card-title>团队简介</b-card-title>
          <b-card-text>
            <p>你可以在团队里新建会议室，与小伙伴一起工作、一起进行头脑风暴</p>
            <p>你还可以邀请新朋友加入你们的团队！</p>
          </b-card-text>
        </b-card-body>
        <b-list-group flush>
          <b-list-group-item
            button
            v-b-modal.invite-team-member
            class="group-item-invite"
            @click="isInviting = true">
            邀请新成员
          </b-list-group-item>
          <b-list-group-item
            button
            v-b-modal.create-new-group
            class="group-item-create">
            新建会议室
          </b-list-group-item>
          <b-list-group-item
            v-b-modal.bv-modal-dismiss-group
            class="group-item-dismiss"
            v-show="isFounder">
            解散团队
          </b-list-group-item>
          <b-list-group-item
            v-b-modal.bv-modal-leave-group
            class="group-item-leave"
            v-show="!isFounder">
            离开团队
          </b-list-group-item>
        </b-list-group>
        <b-card-footer>
          <div class="d-flex justify-content-between">
            <small>指尖宇宙</small>
            <small>团队ID: {{ teamID }}</small>
          </div>
        </b-card-footer>
      </b-card>
    </div>
    <div class="team-lists">
      <div class="team-member-list">
        <team-member-list groupType="Team"></team-member-list>
      </div>
      <div class="team-conference-lists">
        <conference-list ref="conferenceList"></conference-list>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import InviteNewMember from './InviteNewMember'
import ConferenceList from '../Team/ConferenceList'
import CreateNewGroup from '../Team/CreateNewGroup.vue'
import TeamMemberList from './TeamMemberList'
import DismissGroup from '../Team/DismissGroup'
import LeaveGroup from './LeaveGroup'
export default {
  name: 'TeamOfUser',
  data: function () {
    return {
      teamName: '',
      founderID: 0,
      isFounder: false,
      isInviting: ''
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
    createConferenceSuccess () {
      this.$refs.conferenceList.checkConference()
    },
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
    TeamMemberList,
    InviteNewMember,
    ConferenceList,
    CreateNewGroup,
    DismissGroup,
    LeaveGroup
  },
  created () {
    this.$io.on('leave', () => {
      alert('您已被移出团队')
      this.$router.push({ path: '/team/teampage' })
    })
  },
  beforeDestroy () {
    this.$io.off('leave')
  }
}
</script>
<style scoped>
.single-team {
  margin-top: 6px;
}

.team-info-area {
  width: 400px;
  height: 700px;
}

.team-member-list,
.team-conference-lists {
  width: 800px;
}

.team-conference-lists {
  margin-top: 40px;
}

.team-info-card {
  min-width: 20rem;
  max-width: 22rem;
  border-radius: 5px;
  box-shadow: 1px 1px 5px #dbdbdb;
}

.group-item-create,
.group-item-invite,
.group-item-dismiss,
.group-item-leave {
  text-align: center;
}
</style>

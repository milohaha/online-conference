<template>
  <div class="team-page">
    <create-new-group groupType="Team" @createSuccess="getTeamCreated"></create-new-group>
    <team-join></team-join>
    <div class="team-create-page">
      <div>
        <b-link class="team-create-update-link" @click="getTeamCreated">
          <span class="mx-4">我创建的团队</span>
        </b-link>
      </div>
      <div class="created-teams">
        <b-card-group class="team-group">
          <team-in-list
            v-for="teamCreated in teamsCreated"
            :key="teamCreated.id"
            :teamID="teamCreated.id"
            :teamName="teamCreated.teamName">
          </team-in-list>
          <b-card
            class="m-4 team-create-card align-items-center"
            bg-variant="light">
            <b-button
              class="fmtfont fmt-add team-create-button"
              variant="light"
              v-b-modal.create-new-group
              v-b-popover.hover.right="'创建团队'">
            </b-button>
          </b-card>
        </b-card-group>
      </div>
    </div>
    <div class="team-join-page my-3">
      <div>
        <b-link class="team-join-update-link" @click="getTeamJoined">
          <span class="mx-4">我加入的团队</span>
        </b-link>
      </div>
      <div class="joined-teams">
        <b-card-group class="team-group">
          <team-in-list
            v-for="teamJoined in teamsJoined"
            :key="teamJoined.id"
            :teamID="teamJoined.id"
            :teamName="teamJoined.teamName">
          </team-in-list>
          <b-card
            class="m-4 team-join-card align-items-center"
            bg-variant="light">
            <b-button
              class="fmtfont fmt-add team-join-button"
              variant="light"
              v-b-modal.bv-modal-join-team
              v-b-popover.hover.right="'加入团队'">
            </b-button>
          </b-card>
        </b-card-group>
      </div>
    </div>
  </div>
</template>
<script>
import TeamInList from '../../components/Team/TeamInList'
import CreateNewGroup from '../Team/CreateNewGroup'
import TeamJoin from '../../components/Team/TeamJoin'
import { mapState } from 'vuex'
import Api from '../../api'
export default {
  data: function () {
    return {
      teamsCreated: [],
      teamsJoined: []
    }
  },
  components: {
    TeamInList,
    CreateNewGroup,
    TeamJoin
  },
  computed: {
    ...mapState({
      userID: (state) => state.Login.userID
    })
  },
  created: function () {
    this.getTeamCreated()
    this.getTeamJoined()
  },
  methods: {
    getTeamCreated () {
      Api.getTeamCreatedByMe({ userID: this.userID }).then(response => {
        this.teamsCreated = response.data.teams
      })
    },
    getTeamJoined () {
      Api.getTeamJoined({ userID: this.userID }).then(response => {
        this.teamsJoined = response.data.teams
      })
    }
  }
}
</script>
<style scoped>
.team-create-page,
.team-join-page {
  width: 1360px;
  height: 450px;
}

span {
  font-family: KaiTi, serif, sans-serif, cursive, fantasy, monospace;
  font-size: 24px;
}

.team-create-update-link,
.team-join-update-link {
  text-decoration: none;
  color: #044;
}

.team-group {
  overflow-y: scroll;
  max-height: 420px;
}

.team-create-card,
.team-join-card {
  min-width: 16rem;
  max-width: 16rem;
  border-radius: 5px;
  box-shadow: 1px 1px 5px #7f7f7f;
}

.team-create-button,
.team-join-button {
  line-height: 4;
}
</style>

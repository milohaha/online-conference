<template>
  <div class="team-manage">
    <team-join></team-join>
    <create-new-group groupType="Team"></create-new-group>
    <div class="create-join-button">
      <b-button
        class="create-button"
        variant="light"
        v-b-modal.create-new-group
      >
        创建团队
      </b-button>
      <b-button class="join-button"
                variant="light"
                v-b-modal.bv-modal-join-team>
        加入团队
      </b-button>
    </div>
    <div class="teams">
      <b-card class="m-0 p-0">
        <b-card-header>
          <b-button v-b-toggle.team-created
                    class="team-created-button"
                    variant="light"
                    @click="getTeamCreated">我创建的团队</b-button>
        </b-card-header>
        <b-collapse id="team-created">
          <b-list-group>
            <b-list-group-item v-for="team in teamsCreated"
                               :key="team.id">
              <team-in-list :teamID="team.id"
                            :teamName="team.teamName"
                            type="created">
              </team-in-list>
            </b-list-group-item>
          </b-list-group>
        </b-collapse>
      </b-card>
      <b-card>
        <b-card-header>
          <b-button v-b-toggle.team-joined
                    class="team-join-button"
                    variant="light"
                    @click="getTeamJoined">我加入的团队</b-button>
        </b-card-header>
        <b-collapse id="team-joined">
          <b-list-group>
            <b-list-group-item v-for="team in teamsJoined"
                               :key="team.id">
              <team-in-list :teamID="team.id"
                            :teamName="team.teamName"
                            type="joined">
              </team-in-list>
            </b-list-group-item>
          </b-list-group>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>
<script>
import TeamInList from '../Team/TeamInList.vue'
import CreateNewGroup from '../Team/CreateNewGroup'
import TeamJoin from '../Team/TeamJoin'
import Api from '../../api'
import { mapState } from 'vuex'
export default {
  name: 'TeamManage',
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
.team-manage {
  padding: 15px;
  background-color: #cddcee;
  border-radius: 4px;
}

.create-join-button {
  padding: 10px 10px 10px 0;
}

.create-button {
  margin-right: 20px;
}
</style>

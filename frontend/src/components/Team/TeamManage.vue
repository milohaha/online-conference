<template>
  <div class="team-manage">
    <div class="create-join-button">
      <b-button class="create-button" variant="light" to="/team/teambuild">创建团队</b-button>
      <b-button class="join-button" variant="light" to='/team/teamjoin'>加入团队</b-button>
    </div>
    <div class="teams">
      <b-card>
        <b-card-header>
          <b-button v-b-toggle.team-built class="team-built-button" variant="light">我创建的团队</b-button>
        </b-card-header>
        <b-collapse id="team-built">
            <b-list-group>
              <b-list-group-item v-for="team in teamsBuilt"
              :key="team.teamID">
                <team-in-list
                  :teamID="team.teamID"
                  :teamName="team.teamName"
                  type="built">
                </team-in-list>
              </b-list-group-item>
            </b-list-group>
        </b-collapse>
      </b-card>
      <b-card>
        <b-card-header>
          <b-button v-b-toggle.team-joined class="team-join-button" variant="light">我加入的团队</b-button>
        </b-card-header>
        <b-collapse id="team-joined">
          <b-list-group>
            <b-list-group-item v-for="team in teamsJoined"
            :key="team.teamID">
              <team-in-list
                :teamID="team.teamID"
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
export default {
  name: 'TeamManage',
  data: function () {
    return {
      teamsBuilt: [
        {
          teamID: 111,
          teamName: '团队1'
        },
        {
          teamID: 222,
          teamName: '团队2'
        }
      ],
      teamsJoined: [
        {
          teamID: 333,
          teamName: '团队3'
        },
        {
          teamID: 444,
          teamName: '团队4'
        }
      ]
    }
  },
  components: {
    TeamInList
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
  padding: 10px;
  padding-left: 0;
}

.create-button {
  margin-right: 20px;
}
</style>

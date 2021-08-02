<template>
  <div class="leave-team">
    <b-modal
      id="bv-modal-leave-team"
      ref="my-modal-leave-team"
      scrollable
      hide-backdrop
      centered
      hide-footer
      no-close-on-backdrop
      no-stacking>
      <template #modal-title>
        离开团队
      </template>
      <div class="d-block text-center">
        你确定要离开团队吗？
      </div>
      <div class="d-flex justify-content-center">
        <b-button
          size="lg"
          pill
          variant="outline-success"
          class="modal-confirm-button mt-2"
          @click="leaveTeam"
          v-b-modal.bv-modal-leave-team-notice>
          确认
        </b-button>
        <b-button
        size="lg"
        pill
        variant="outline-warning"
        class="modal-cancal-button mt-2"
        @click="$bvModal.hide('bv-modal-leave-team')">
          取消
        </b-button>
      </div>
    </b-modal>
    <b-dropdown-item
      variant="outline-primary"
      class="join-team-button"
      v-b-modal.bv-modal-leave-team>
      离开团队
    </b-dropdown-item>
    <b-modal
      id="bv-modal-leave-team-notice"
      ref="my-modal-leave-team-notice"
      hide-backdrop
      centered>
      <div class="d-block text-center">
        离开团队成功！
      </div>
      <template #modal-footer>
        <b-button @click="leaveTeamSuccess">
          确定
        </b-button>
      </template>
    </b-modal>

  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      userID: (state) => state.Login.userID,
      teamID: (state) => state.Team.teamID
    })
  },
  methods: {
    leaveTeam () {
      this.$io.emit(
        'leaveNotice',
        this.userID,
        this.$constant.IS_TEAM,
        this.$constant.LEAVE,
        this.teamID
      )
    },
    leaveTeamSuccess () {
      this.$bvModal.hide('bv-modal-leave-team-notice')
      this.$router.push({ path: '/team/teammanage' })
    }
  }
}
</script>

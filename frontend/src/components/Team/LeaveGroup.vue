<template>
  <div class="leave-group">
    <b-modal
      id="bv-modal-leave-group"
      ref="my-modal-leave-group"
      scrollable
      hide-backdrop
      centered
      hide-footer
      no-close-on-backdrop
      no-stacking>
      <template #modal-title>
        离开{{ typeName }}
      </template>
      <div class="d-block text-center">
        你确定要离开{{ typeName }}吗？
      </div>
      <div class="d-flex justify-content-center">
        <b-button
          size="lg"
          pill
          variant="outline-success"
          class="modal-confirm-button mt-2"
          @click="leaveGroup"
          v-b-modal.bv-modal-leave-group-notice>
          确认
        </b-button>
        <b-button
        size="lg"
        pill
        variant="outline-warning"
        class="modal-cancel-button mt-2"
        @click="$bvModal.hide('bv-modal-leave-group')">
          取消
        </b-button>
      </div>
    </b-modal>
    <b-modal
      id="bv-modal-leave-group-notice"
      ref="my-modal-leave-group-notice"
      hide-backdrop
      centered>
      <div class="d-block text-center">
        离开{{ typeName }}成功！
      </div>
      <template #modal-footer>
        <b-button @click="leaveGroupSuccess">
          确定
        </b-button>
      </template>
    </b-modal>

  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    type: String
  },
  computed: {
    ...mapState({
      userID: (state) => state.Login.userID,
      teamID: (state) => state.Team.teamID,
      conferenceID: (state) => state.Team.conferenceID
    }),
    typeName () {
      return this.type === 'Team' ? '团队' : '会议室'
    }
  },
  methods: {
    leaveTeam () {
      this.$io.emit(
        'leaveNotice',
        this.userID,
        this.$constant.LEAVE,
        this.$constant.IS_TEAM,
        this.teamID
      )
    },
    leaveConference () {
      this.$io.emit(
        'leaveNotice',
        this.userID,
        this.$constant.LEAVE,
        this.$constant.IS_CONFERENCE,
        this.conferenceID
      )
    },
    leaveGroup () {
      this.type === 'Team' ? this.leaveTeam() : this.leaveConference()
    },
    leaveGroupSuccess () {
      this.$bvModal.hide('bv-modal-leave-group-notice')
      this.$router.push({ path: '/team/teammanage' })
    }
  }
}
</script>

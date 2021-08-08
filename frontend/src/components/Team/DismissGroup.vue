<template>
  <div class="dismiss-group">
    <b-modal
      id="bv-modal-dismiss-group"
      hide-backdrop
      centered
      hide-footer
      no-stacking>
      <template #modal-title>
        解散{{ typeName }}
      </template>
      <div class="d-block text-center">
        你确定要解散{{ typeName }}吗？
      </div>
      <div class="d-flex justify-content-center">
        <b-button
          size="lg"
          pill
          variant="outline-success"
          class="modal-confirm-button mt-2"
          @click="dismissGroup"
          v-b-modal.bv-modal-dismiss-group-notice>
          确认
        </b-button>
        <b-button
          size="lg"
          pill
          variant="outline-warning"
          class="modal-cancel-button mt-2"
          @click="$bvModal.hide('bv-modal-dismiss-group')">
          取消
        </b-button>
      </div>
    </b-modal>
    <b-modal
      id="bv-modal-dismiss-group-notice"
      hide-backdrop
      centered>
      <div class="d-block text-center">
        解散{{ typeName }}成功！
      </div>
      <template #modal-footer>
        <b-button @click="dismissGroupSuccess">
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
    type: String,
    conferenceID: Number
  },
  computed: {
    ...mapState({
      teamID: state => state.Team.teamID
    }),
    typeName () {
      return this.type === 'Team' ? '团队' : '会议室'
    }
  },
  methods: {
    dismissTeam () {
      this.$io.emit('dismissNotice',
        this.$constant.IS_TEAM,
        this.teamID)
    },
    dismissConference () {
      this.$io.emit('dismissNotice',
        this.$constant.IS_CONFERENCE,
        this.conferenceID)
    },
    dismissGroup () {
      this.type === 'Team' ? this.dismissTeam() : this.dismissConference()
    },
    dismissGroupSuccess () {
      this.$bvModal.hide('bv-modal-dismiss-group-notice')
      this.$router.push({ path: '/team/teampage' })
    }
  }
}
</script>

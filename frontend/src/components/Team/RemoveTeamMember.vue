<template>
  <div class="remove-team-member">
    <b-button @click="showModal">
      移除
    </b-button>
    <b-modal
      :id="modalID"
      ref="bv-modal-remove-team-member"
      hide-backdrop
      centered
      hide-footer>
      <template #modal-title>
        移除成员
      </template>
      <div class="d-block text-center">
        <h3>您确定要移除该成员吗？</h3>
      </div>
      <div>
        <b-button
          block variant="success"
          @click="removeTeamMember"
        >
          确定
        </b-button>
        <b-button
          @click="hideModal">
          取消
        </b-button>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    userID: Number,
    modalID: String
  },
  computed: {
    ...mapState({
      teamID: state => state.Team.teamID
    })
  },
  methods: {
    removeTeamMember () {
      this.$io.emit('leaveNotice',
        this.userID,
        this.$constant.REMOVED,
        this.$constant.IS_TEAM,
        this.teamID)
      this.$emit('remove', this.userID)
      this.$bvModal.hide(this.modalID)
    },
    hideModal () {
      this.$bvModal.hide(this.modalID)
    },
    showModal () {
      this.$bvModal.show(this.modalID)
    }
  }
}
</script>

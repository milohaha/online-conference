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
        <h3>你确定要解散{{ typeName }}吗？</h3>
      </div>
      <div class="d-flex justify-content-center my-3">
        <b-button
          size="lg"
          pill
          variant="outline-success"
          class="modal-confirm-button mt-2 mx-2"
          @click="dismissGroup"
          v-b-modal.bv-modal-dismiss-group-notice>
          确认
        </b-button>
        <b-button
          size="lg"
          pill
          variant="outline-warning"
          class="modal-cancel-button mt-2 mx-2"
          @click="$bvModal.hide('bv-modal-dismiss-group')">
          取消
        </b-button>
      </div>
    </b-modal>
    <b-modal
      id="bv-modal-dismiss-group-notice"
      hide-backdrop
      centered>
      <template #modal-header>
        解散{{ typeName }}
      </template>
      <div class="d-block text-center">
        <h3>解散{{ typeName }}成功！</h3>
      </div>
      <template #modal-footer>
        <b-button @click="dismissGroupSuccess" variant="outline-success">
          确定
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
export default {
  props: {
    type: Number,
    groupID: Number
  },
  computed: {
    typeName () {
      return this.type === this.$constant.IS_TEAM ? '团队' : '会议室'
    }
  },
  methods: {
    dismissGroup () {
      this.$io.emit('dismissNotice',
        this.type,
        this.groupID)
    },
    dismissGroupSuccess () {
      this.$bvModal.hide('bv-modal-dismiss-group-notice')
      const path = this.type === this.$constant.IS_TEAM ? '/team/teampage' : '/team/teamofuser'
      this.$router.push({ path: path })
    }
  }
}
</script>

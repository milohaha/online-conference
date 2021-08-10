<template>
  <div class="remove-team-member">
    <b-button @click="showModal" variant="outline-danger">
      移除
    </b-button>
    <b-modal
      :id="modalID"
      centered>
      <template #modal-title>
        移除成员
      </template>
      <div class="d-block text-center">
        <h4 class="text-danger">您确定要移除该成员吗？</h4>
      </div>
      <template #modal-footer>
        <b-button
          class="mx-2"
          variant="outline-success"
          @click="removeMember">
          确定
        </b-button>
        <b-button
          variant="outline-warning"
          @click="hideModal">
          取消
        </b-button>
      </template>
    </b-modal>
    <b-modal
      centered
      id="remove-success-notice">
      <template #modal-header>
        移除成员
      </template>
      <div class="text-center">
        <h4 class="text-success">移除成员成功！</h4>
      </div>
      <template #modal-footer>
        <b-button
          @click="removeSuccess"
          variant="outline-success">
          确定
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
export default {
  props: {
    userID: Number,
    modalID: String
  },
  methods: {
    removeMember () {
      this.$emit('remove', this.userID)
      this.$bvModal.show('remove-success-notice')
    },
    hideModal () {
      this.$bvModal.hide(this.modalID)
    },
    showModal () {
      this.$bvModal.show(this.modalID)
    },
    removeSuccess () {
      this.$bvModal.hide('remove-success-notice')
      this.hideModal()
    }
  }
}
</script>

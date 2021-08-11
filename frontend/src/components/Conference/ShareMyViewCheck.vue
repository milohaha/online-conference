<template>
  <b-modal
  hide-header
  id="share-view-check"
  >
    接收到共享视角邀请，是否同意？
    <template #modal-footer>
      <b-button variant="light" @click="agree">确定</b-button>
      <b-button variant="light" @click="reject">取消</b-button>
    </template>
  </b-modal>
</template>
<script>
export default {
  methods: {
    agree () {
      this.$emit('agree')
      this.$bvModal.hide('share-view-check')
    },
    reject () {
      this.$emit('reject')
      this.$bvModal.hide('share-view-check')
    }
  }
}
</script>

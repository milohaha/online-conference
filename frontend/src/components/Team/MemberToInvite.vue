<template>
  <b-list-group-item
    class="d-flex justify-content-between align-items-center"
    button
    @click="selectMember">
    <member-item
      :member="memberToInvite"
      :founderID="0"
    >
    </member-item>
    <b-icon icon="check" class="h1" variant="success" v-if="isSelected"></b-icon>
  </b-list-group-item>
</template>
<script>
import MemberItem from './MemberItem.vue'
export default {
  data () {
    return {
      isSelected: false
    }
  },
  props: {
    memberToInvite: Object
  },
  methods: {
    selectMember () {
      this.isSelected = !this.isSelected
      this.$emit('selectMember', this.memberToInvite.id)
    }
  },
  components: {
    MemberItem
  }
}
</script>

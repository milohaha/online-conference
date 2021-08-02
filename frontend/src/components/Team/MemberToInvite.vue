<template>
  <b-list-group-item
    class="d-flex justify-content-around align-items-center"
    button
    @click="selectMember">
    <b-avatar variant="primary" icon="people-fill" size="6rem"></b-avatar>
    <div class="flex-column">
      <p class="text-lg-start">UserName: {{ memberToInvite.userName }}</p>
      <p class="text-lg-start">id: {{ memberToInvite.id }}</p>
      <p class="text-lg-start">email: {{ memberToInvite.email }}</p>
    </div>
    <b-icon icon="check" class="h1" variant="success" v-if="isSelected"></b-icon>
  </b-list-group-item>
</template>
<script>
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
  }
}
</script>

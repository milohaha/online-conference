<template>
  <div class="conference">
    <div class="conference-content">
      <b-avatar variant="success" icon="tags" class="mx-2"></b-avatar>
      <span class="conference-name">{{ conferenceName }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ConferenceInList',
  props: {
    conferenceName: String
  }
}
</script>
<style scoped>
.conference {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conference-content {
  display: flex;
  align-items: center;
}

.conference-name {
  display: inline-block;
  max-width: 300px;
}

</style>

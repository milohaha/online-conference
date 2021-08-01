<template>
  <div>
    <b-dropdown no-caret right variant='link' size='sm'>
      <template v-slot:button-content>
        <img src="../../../assets/picture/astronaut.png" alt="userLogo" class="user-logo">
      </template>
      <b-dropdown-item>
        <b-icon icon='door-open'></b-icon>
        回到主页
      </b-dropdown-item>
      <b-dropdown-item>
        <b-icon icon='cursor-fill'></b-icon>
        注销用户
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>
<script>
export default {
  name: 'UserLogo'
}
</script>
<style scoped>
.user-logo {
  width: 45px;
  height: 45px;
}
</style>

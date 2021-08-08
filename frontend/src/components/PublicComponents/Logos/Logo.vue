<template>
  <div>
    <b-link to="/">
      <img src="../../../assets/picture/planet.png" alt="logo">
    </b-link>
    <span :style="{ color: logoColor }">FMT</span>
  </div>
</template>
<script>
export default {
  name: 'logo',
  props: {
    logoColor: {
      String,
      default: '#111111'
    }
  }
}
</script>
<style scoped>
div {
  display: flex;
  align-items: center;
}

img {
  width: 55px;
  height: 55px;
  margin-right: 5px;
}

span {
  font-family: Logo, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 30px;
}
</style>

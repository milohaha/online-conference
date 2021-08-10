<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  mounted () {
    this.$io.emit('userIntoApp', parseInt(localStorage.getItem('userID')))
  }
}
</script>

<style lang="scss">
@import 'assets/font/font.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

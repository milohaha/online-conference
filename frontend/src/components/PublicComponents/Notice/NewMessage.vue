<template>
  <div>
    <b-link  @click="updateMessages">
      <b-icon icon="bell"></b-icon>
    </b-link>
    <div class="message-num" v-show="newMessageNum > 0">
      <p>{{ newMessageNum }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'NewMessageIcon',
  props: {
    newMessageNum: Number
  },
  methods: {
    updateMessages () {
      this.$emit('click')
    }
  }
}
</script>
<style scoped>
.message-num {
  background-color: #ffc90e;
  border-radius: 20px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 20px;
  right: 6px;
}

p {
  font-size: 3px;
  margin: 0;
  padding: 0;
  color: darkblue;
}
</style>

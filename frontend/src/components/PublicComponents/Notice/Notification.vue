<template>
  <div>
  <b-dropdown size="lg" variant="link" right no-caret>
    <template #button-content>
      <b-icon icon="bell" style="color: #fff"></b-icon>
    </template>
    <b-tabs pills style="width: 569px;" align="center">
      <b-tab title="验证消息" active>
        <verification></verification>
        <verification></verification>
        <verification></verification>
        </b-tab>
      <b-tab title="通知消息">
        <message></message>
        <message></message>
        <message></message>
      </b-tab>
    </b-tabs>
  </b-dropdown>
</div>
</template>
<script>
import verification from './Verification.vue'
import Message from './Message.vue'
export default {
  components: {
    verification,
    Message
  }
}
</script>

<template>
  <div id="recentfile">
      <h2 class="title">最近文件</h2>
      <div class="button">
        <b-button variant="outline-primary" id="delete" @click="deletefile">删除</b-button>
        <b-button variant="outline-primary" id="share">共享</b-button>
      </div>
      <b-form-checkbox-group id="selectfile" v-model="selectedFile">
        <b-form-checkbox v-for="(file,index) in files" :key="index" :value="file.value" size="lg" class="file">
          <b-link :to="file.value">{{ file.text }}</b-link>
        </b-form-checkbox>
      </b-form-checkbox-group>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      selectedFile: [],
      files: [
        { text: '文件1', value: '1' },
        { text: '文件2', value: '2' },
        { text: '文件3', value: '3' },
        { text: '文件4', value: '4' }
      ]
    }
  },
  methods: {
    deletefile () {
      for (let i = 0; i < this.files.length; i++) {
        if (this.selectedFile.indexOf(this.files[i].value) !== -1) {
          this.files.splice(i, 1)
          i--
        }
      }
      this.selectedFile.length = 0
    }
  }
}
</script>
<style scoped>
#recentfile {
  margin: 0;
  margin-left: 50px;
}
.button {
  margin-top: 20px;
}
#share {
  margin-left: 20px;
}
#selectfile {
  margin-top: 20px;
}
.file {
  margin: 10px;
}
</style>

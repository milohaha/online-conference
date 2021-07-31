<template>
  <div class="recent-file">
      <h2 class="title">最近文件</h2>
      <div class="file-operation">
        <b-button variant="outline-primary" class="delete" @click="deleteFile">删除</b-button>
        <b-button variant="outline-primary" class="share">共享</b-button>
      </div>
      <b-form-checkbox-group class="select-file" v-model="selectedFiles">
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
      selectedFiles: [],
      files: [
        { text: '文件1', value: '1' },
        { text: '文件2', value: '2' },
        { text: '文件3', value: '3' },
        { text: '文件4', value: '4' }
      ]
    }
  },
  methods: {
    deleteFile () {
      for (const selectFile of this.selectedFiles) {
        for (const index in this.files) {
          if (this.files[index].value === selectFile) {
            this.files.splice(index, 1)
            break
          }
        }
      }
      this.selectedFiles.length = 0
    }
  }
}
</script>
<style scoped>
.recent-file {
  margin: 0;
}
.file-operation {
  margin-top: 20px;
}
.share {
  margin-left: 20px;
}
.select-file {
  margin-top: 20px;
}
.file {
  margin: 10px;
}
</style>

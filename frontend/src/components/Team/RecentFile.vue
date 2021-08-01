<template>
  <div class="recent-file">
      <h2 class="title">最近文件</h2>
      <div class="func-button">
        <b-button variant="outline-primary" class="delete-button" @click="deleteFile">删除</b-button>
        <b-button variant="outline-primary" class="share-button">共享</b-button>
      </div>
      <b-form-checkbox-group class="select-file" v-model="selectedFiles">
        <b-form-checkbox v-for="file in files" :key="file.fileId" :value="file.fileId" size="lg" class="file">
          <b-link :to="file.fileId">{{ file.fileContent }}</b-link>
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
        { fileContent: '文件1', fileId: '1' },
        { fileContent: '文件2', fileId: '2' },
        { fileContent: '文件3', fileId: '3' },
        { fileContent: '文件4', fileId: '4' }
      ]
    }
  },
  methods: {
    deleteFile () {
      for (const selectedFile of this.selectedFiles) {
        this.files.splice(this.files.findIndex(file => file.fileId === selectedFile), 1)
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

.funcbutton {
  margin-top: 20px;
}

.share-button {
  margin-left: 20px;
}

.select-file {
  margin-top: 20px;
}

.file {
  margin: 10px;
}

h2 {
  margin-bottom: 20px;
}
</style>

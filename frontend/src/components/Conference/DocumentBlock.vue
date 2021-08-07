<template>
  <div class="Container" :id="'docContainer'+identifier"
       ref="documentDiv"
       style="position: absolute; left: 0; top: 0;">
    <span style="background-color: red;"
          @mousedown="drag">点击此处拖拽</span>
    <textarea ref="documentBlock"></textarea>
    <b-button variant="outline-primary"
              class="options-button"
              @click="deleteComponent">删除文档块</b-button>
  </div>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import CodeMirror from 'codemirror/lib/codemirror.js'
import ot from '../../ot.js'
import socketio from 'socket.io-client'
import Vue from 'vue'

export default {
  name: 'documentBlock',
  props: {
    identifier: String,
    initPosition: Object
  },
  data () {
    return {
      client: undefined
    }
  },
  methods: {
    deleteComponent () {
      this.$emit('remove', this.identifier)
    },
    drag (e) {
      const docDiv = document.getElementById(`docContainer${this.identifier}`)
      const disX = e.clientX - docDiv.offsetLeft
      const disY = e.clientY - docDiv.offsetTop
      document.onmousemove = (ev) => {
        const left = ev.clientX - disX
        const top = ev.clientY - disY
        docDiv.style.left = left + 'px'
        docDiv.style.top = top + 'px'
        this.$emit('moveDocumentBlock', { left: left, top: top, docID: this.identifier })
      }
      // 避免频繁更新数据库
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
        Vue.prototype.$io.emit('dragBlockStop', { left: parseInt(docDiv.style.left), top: parseInt(docDiv.style.top), docID: this.identifier })
      }
    }
  },
  mounted () {
    // Initialize Position
    const docDiv = document.getElementById(`docContainer${this.identifier}`)
    const left = this.initPosition ? this.initPosition.left : 0
    const top = this.initPosition ? this.initPosition.top : 0
    docDiv.style.left = left + 'px'
    docDiv.style.top = top + 'px'
    const ioClient = socketio.connect(process.env.VUE_APP_WEB_BASE, { transports: ['websocket'] })
    const that = this
    ioClient.emit('enterDocumentBlock', this.identifier) // docID
    ioClient.on('doc', function (data) {
      const codeMirror = CodeMirror.fromTextArea(that.$refs.documentBlock, { lineNumbers: true, lineWrapping: true })
      codeMirror.setSize('400px', '400px')
      codeMirror.setValue(data.str)
      const serverAdapter = new ot.SocketIOAdapter(ioClient)
      const editorAdapter = new ot.CodeMirrorAdapter(codeMirror)
      this.client = new ot.EditorClient(data.revision, data.clients, serverAdapter, editorAdapter)
    })
  }
}
</script>

<style scoped>
.Container {
  border: #2c3e50 1px solid;
}
</style>

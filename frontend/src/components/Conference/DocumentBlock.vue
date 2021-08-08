<template>
  <div class="Container"
       :id="'docContainer'+identifier"
       ref="documentDiv"
       style="position: absolute; left: 0; top: 0;">
    <span style="background-color: red;"
          @mousedown="drag">点击此处拖拽</span>
    <textarea ref="documentBlock"></textarea>
    <b-dropdown v-if="initParams.type==='code'"
                id="dropdown-1"
                text="Language"
                class="m-md-2">
      <b-dropdown-item @click="changeMode('javascript')">javascript</b-dropdown-item>
      <b-dropdown-item @click="changeMode('x-python')">python</b-dropdown-item>
      <b-dropdown-item @click="changeMode('x-csrc')">C</b-dropdown-item>
      <b-dropdown-item @click="changeMode('x-c++src')">C++</b-dropdown-item>
      <b-dropdown-item @click="changeMode('x-java')">java</b-dropdown-item>
      <b-dropdown-item @click="changeMode('x-sh')">shell</b-dropdown-item>
      <b-dropdown-item @click="changeMode('x-sql')">sql</b-dropdown-item>
    </b-dropdown>
    <b-button variant="outline-primary"
              class="options-button"
              @click="deleteComponent">删除</b-button>
  </div>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/theme/darcula.css'
import ot from '../../ot.js'
import socketio from 'socket.io-client'
import Vue from 'vue'
// 语法高亮库
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/shell/shell.js'
import 'codemirror/mode/sql/sql.js'

export default {
  name: 'documentBlock',
  props: {
    identifier: String,
    initParams: Object
  },
  data () {
    return {
      client: undefined,
      codeMirror: undefined,
      codeOptions: {
        mode: 'text/javascript',
        tabSize: 4,
        theme: 'darcula',
        lineNumbers: true,
        line: true
      },
      textOptions: {
        lineNumbers: true,
        lineWrapping: true
      }
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
    },
    changeMode (chosenMode) {
      this.codeMirror.setOption('mode', `text/${chosenMode}`)
      this.$emit('changeLanguage', { language: `${chosenMode}`, docID: this.identifier })
    }
  },
  mounted () {
    // Initialize
    const docDiv = document.getElementById(`docContainer${this.identifier}`)
    const { left, top, type, language } = this.initParams
    docDiv.style.left = left + 'px'
    docDiv.style.top = top + 'px'
    const ioClient = socketio.connect(process.env.VUE_APP_WEB_BASE, { transports: ['websocket'] })
    const that = this
    ioClient.emit('enterDocumentBlock', this.identifier) // docID
    this.$nextTick(() => {
      ioClient.on('doc', function (data) {
        let options
        if (type === 'text') {
          options = that.textOptions
        } else {
          options = that.codeOptions
          options.mode = language
        }
        that.codeMirror = CodeMirror.fromTextArea(that.$refs.documentBlock, options)
        that.codeMirror.setSize('400px', '400px')
        that.codeMirror.setValue(data.str)
        const serverAdapter = new ot.SocketIOAdapter(ioClient)
        const editorAdapter = new ot.CodeMirrorAdapter(that.codeMirror)
        that.client = new ot.EditorClient(data.revision, data.clients, serverAdapter, editorAdapter)
      })
    })
    Vue.prototype.$io.on('changeLanguage', (params) => {
      if (params.docID === this.identifier) {
        that.codeMirror.setOption('mode', `text/${params.language}`)
      }
    })
  }
}
</script>

<style scoped>
.Container {
  border: #2c3e50 1px solid;
}
</style>

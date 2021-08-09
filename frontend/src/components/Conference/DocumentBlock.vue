<template>
  <div class="container"
       :id="'doc-container'+identifier"
       ref="documentDiv"
       @mousedown="click"
       @dblclick="$emit('remove',identifier)"
       style="position: absolute; left: 0; top: 0;">
    <textarea ref="documentBlock"
              id="'textarea'+identifier"></textarea>
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
    click (e) {
      this.$emit('click', e, document.getElementById(`docContainer${this.identifier}`))
    },
    getContainer () {
      return this.$refs.documentDiv
    }
  },
  mounted () {
    // Initialize
    const docDiv = document.getElementById(`docContainer${this.identifier}`)
    const { left, top, type, language, zoom } = this.initParams
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
          options.mode = 'text/' + language
        }
        that.codeMirror = CodeMirror.fromTextArea(that.$refs.documentBlock, options)
        that.codeMirror.setSize(400 * zoom, 400 * zoom)
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
.container {
  border: #2c3e50 1px solid;
  font-size: 14px;
}
</style>

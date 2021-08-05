<template>
  <div>
    <textarea ref="textarea"></textarea>
    <b-dropdown id="dropdown-1"
                text="Language"
                class="m-md-2">
      <b-dropdown-item @click="changeMode('javascript')">javascript</b-dropdown-item>
      <b-dropdown-item @click="changeMode('x-python')">python</b-dropdown-item>
      <b-dropdown-item @click="changeMode('x-csrc')">C</b-dropdown-item>
      <b-dropdown-item @click="changeMode('x-c++src')">C++</b-dropdown-item>
      <b-dropdown-item @click="changeMode('x-java')">java</b-dropdown-item>
      <b-dropdown-item @click="changeMode('x-sh')">shell</b-dropdown-item>
      <b-dropdown-item @click="changeMode('x-sql')">sql</b-dropdown-item>
      <b-dropdown-item @click="changeMode('markdown')">markdown</b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/darcula.css'
// 语法高亮库
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/shell/shell.js'
import 'codemirror/mode/sql/sql.js'
import ot from '../../ot.js'

export default {
  name: 'codeBlock',
  data () {
    return {
      code: '',
      coder: null,
      options: {
        mode: 'text/javascript',
        tabSize: 4,
        theme: 'darcula',
        lineNumbers: true,
        line: true
      }
    }
  },
  mounted () {
    const that = this
    this.$io.emit('enterCodeBlock')
    this.$io.on('doc', function (data) {
      that.coder = CodeMirror.fromTextArea(that.$refs.textarea, that.options)
      that.coder.setValue(data.str)
      const serverAdapter = new ot.SocketIOAdapter(that.$io)
      const editorAdapter = new ot.CodeMirrorAdapter(that.coder)
      const client = new ot.EditorClient(data.revision, data.clients, serverAdapter, editorAdapter)
      console.log(client)
    })
  },
  methods: {
    changeMode (chosenMode) {
      console.log(chosenMode)
      this.coder.setOption('mode', `text/${chosenMode}`)
    }
  }
}
</script>

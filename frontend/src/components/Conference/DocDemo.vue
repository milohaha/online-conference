<template>
  <div>
    <textarea ref="coDocument"></textarea>
  </div>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import CodeMirror from 'codemirror/lib/codemirror.js'
import ot from '../../ot.js'

export default {
  name: 'coDocument',
  mounted () {
    const that = this
    this.$io.emit('enterDocDemo')
    this.$io.on('doc', function (data) {
      const codeMirror = CodeMirror.fromTextArea(that.$refs.coDocument, { lineNumbers: true })
      codeMirror.setValue(data.str)
      const serverAdapter = new ot.SocketIOAdapter(that.$io)
      const editorAdapter = new ot.CodeMirrorAdapter(codeMirror)
      const client = new ot.EditorClient(data.revision, data.clients, serverAdapter, editorAdapter)
      console.log(client)
    })
  }
}

</script>

<template>
  <div class="container"
       :id="'doc-container'+identifier"
       ref="documentDiv"
       @click="click"
       @mousedown="mousedown"
       @dblclick="$emit('remove',identifier)"
       style="position: absolute; left: 0; top: 0;">
    <CommentBlock
      v-if="commentDisplay"
      @click="displayComment"
      :identifier="commentID"
      :ref="'commentBlock'+commentID"
      @addComment="addComment"
      @deleteCommentBlock="deleteCommentBlock"
      @revokeComment="revokeComment"></CommentBlock>
<!--    <span class="block-comment fmtfont fmt-comment" @click="blockComment" ref="block-comment" :id="'commentBlock'+identifier"></span>-->
    <textarea ref="documentBlock" id="'textarea'+identifier"></textarea>
  </div>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/theme/darcula.css'
import ot from '../../ot.js'
import socketio from 'socket.io-client'
// 语法高亮库
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/shell/shell.js'
import 'codemirror/mode/sql/sql.js'
import CommentBlock from '../../components/Conference/CommentBlock'
export default {
  components: {
    CommentBlock
  },
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
      },
      commentID: undefined,
      commentDisplay: false
    }
  },
  methods: {
    addComment (text, commentBlockID) {
      this.$emit('addComment', text, commentBlockID)
    },
    deleteCommentBlock (event, type, identifier) {
      this.commentID = undefined
      this.$emit('deleteCommentBlock', event, 'block', identifier, this.identifier)
    },
    revokeComment (commentID, type) {
      this.$emit('revokeComment', commentID, 'block')
    },
    displayComment (e, type, identifier) {
      this.$emit('displayComment', e, 'block', identifier, this.identifier)
    },
    setCommentContent (comments) {
      const ref = 'commentBlock' + this.commentID
      this.$refs[ref].setCommentContent(comments)
    },
    setCommentID (ID) {
      this.commentID = ID
    },
    setComment (display) {
      this.commentDisplay = display
    },
    click (e) {
      this.$emit('click', { x: e.x, y: e.y }, this.identifier)
    },
    blockComment (e) {
      this.$emit('blockComment', e, 'block', this.commentID, this.identifier)
    },
    mousedown (e) {
      this.$emit('mousedown', e, document.getElementById(`docContainer${this.identifier}`))
    },
    getContainer () {
      return this.$refs.documentDiv
    }
  },
  mounted () {
    // Initialize
    const docDiv = document.getElementById(`docContainer${this.identifier}`)
    const { left, top, type, language, zoom, commentID } = this.initParams
    docDiv.style.left = left + 'px'
    docDiv.style.top = top + 'px'
    if (commentID !== undefined && commentID !== null) {
      this.commentID = commentID
      this.setComment(true)
    }
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
  }
}
</script>

<style scoped>
.container {
  border: #2c3e50 1px solid;
  font-size: 14px;
}

</style>

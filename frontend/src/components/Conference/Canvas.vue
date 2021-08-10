<template>
  <div class="body">
    <div class="options-container">
      <div class="basic-options-container">
        <b-button variant="outline-primary"
                  class="options-button"
                  @click="switchToComment">注解</b-button>
        <b-button variant="outline-primary"
                  class="options-button"
                  @click="switchToCursor">鼠标</b-button>
        <b-button variant="outline-primary"
                  class="options-button"
                  @click="switchToDrag">拖拽</b-button>
        <b-button variant="outline-primary"
                  class="options-button"
                  @click="shareMyView(1)">分享视角</b-button>
        <b-button variant="outline-primary"
                  class="options-button"
                  @click="switchToEraser">橡皮擦</b-button>
        <b-button variant="outline-primary"
                  class="options-button"
                  @click="switchToPen">画笔</b-button>
        <b-button variant="outline-primary"
                  name="rectangle"
                  class="options-button"
                  @click="addShape">矩形</b-button>
        <b-button variant="outline-primary"
                  name="circle"
                  class="options-button"
                  @click="addShape">圆形</b-button>
        <b-button variant="outline-primary"
                  name="triangle"
                  class="options-button"
                  @click="addShape">三角形</b-button>
        <b-button variant="outline-primary"
                  name="itext"
                  class="options-button"
                  @click="addShape">文本</b-button>
        <b-button variant="outline-primary"
                  class="options-button"
                  @click="addDocumentBlock('text')">文档块</b-button>
        <b-dropdown variant="outline-primary"
                    text="代码块"
                    class="options-button">
          <b-dropdown-item @click="addDocumentBlock('code','javascript')">javascript</b-dropdown-item>
          <b-dropdown-item @click="addDocumentBlock('code','x-python')">python</b-dropdown-item>
          <b-dropdown-item @click="addDocumentBlock('code','x-csrc')">C</b-dropdown-item>
          <b-dropdown-item @click="addDocumentBlock('code','x-c++src')">C++</b-dropdown-item>
          <b-dropdown-item @click="addDocumentBlock('code','x-java')">java</b-dropdown-item>
          <b-dropdown-item @click="addDocumentBlock('code','x-sh')">shell</b-dropdown-item>
          <b-dropdown-item @click="addDocumentBlock('code','x-sql')">sql</b-dropdown-item>
        </b-dropdown>
        <span class="file-selector-wrapper">
          <b-button variant="outline-primary"
                    class="options-button"
                    @click="clickFileSelector">上传文件</b-button>
          <input type="file"
                 style="display: none;"
                 id="file-selector"
                 accept="application/pdf"
                 @change="loadFileHandler">
        </span>
      </div>
      <div class="detail-options-container">
        <vs-slider v-model="red"
                   color="red"
                   max="255"></vs-slider>
        <vs-slider v-model="green"
                   color="green"
                   max="255"></vs-slider>
        <vs-slider v-model="blue"
                   color="blue"
                   max="255"></vs-slider>
        <vs-slider v-model="size"
                   color="black"
                   max="20"></vs-slider>
      </div>
      <div class="detail-display-container">
        <button ref="detail-display-button"
                disabled="true"></button>
      </div>
    </div>
    <div class="comment-detail-container" ref="comment-detail-container">
      <div v-for="(comment,index) in currentComments" :key="index">
        <div>
          {{ index }}:{{ comment }}
          <button @click="revokeComment(comment.commentItemID)">删除</button>
        </div>
      </div>
      <input ref="comment-input">
      <button @click="deleteCommentBlock">delete!</button>
      <button @click="addComment">提交</button>
      <button @click="cancelComment">取消</button>
    </div>
    <div class="canvas-container">
      <div class="comment-block-container">
        <CommentBlock v-for="commentBlockID in blocks"
                      :key="commentBlockID"
                      :identifier="commentBlockID"
                      :ref="'commentBlock'+commentBlockID"
                      :init-params="initCommentBlocks.get(commentBlockID)"
                      @click="displayComment">
        </CommentBlock>
      </div>
      <div class='document-block-container'>
        <document-block v-for="docID in documentArray"
                        @mousedown="documentDrag"
                        @click="addCommentBlock"
                        @blockComment="displayComment"
                        :key="docID"
                        :identifier="docID"
                        :ref="'doc'+docID"
                        :init-params="initBlocksOfCanvas.get(docID)"
                        @remove="removeDocumentBlock">
        </document-block>
      </div>
      <div class="file-container">
        <upload-file v-for="fileID in fileArray"
                     @mousedown="fileDrag"
                     :key="fileID"
                     :identifier="fileID"
                     :ref="'file'+fileID"
                     :init-params="initFile.get(fileID)"
                     @remove="removeFile"></upload-file>
      </div>
      <canvas id="canvas"
              width="1200"
              height="800"></canvas>
    </div>
    <div class='document-block-container'>
      <document-block v-for="docID in documentArray"
                      :key="docID"
                      :identifier="docID"
                      :ref="'doc'+docID"
                      :init-params="initBlocksOfCanvas.get(docID)"
                      @remove="removeDocumentBlock"
                      @moveDocumentBlock="notifyMove"
                      @changeLanguage="notifyChangeLanguage">
      </document-block>
    </div>
    <div class="file-container">
      <upload-file v-for="fileID in fileArray"
                   :key="fileID"
                   :identifier="fileID"
                   :ref="'file'+fileID"
                   :init-params="initFile.get(fileID)"
                   @moveFile="notifyMoveFile"
                   @remove="removeFile"></upload-file>
    </div>
  </div>
</template>

<script>
import { fabric } from 'fabric'
import './eraser_brush.mixin'
import { v1 as uuid } from 'uuid'
import DocumentBlock from './DocumentBlock.vue'
import UploadFile from './UploadFile.vue'
import CommentBlock from './CommentBlock.vue'
import { mapState } from 'vuex'
export default {
  name: 'Canvas',
  data: function () {
    return {
      red: 0,
      green: 0,
      blue: 0,
      size: 3,
      canvas: undefined,
      conferenceID: 1,
      uuid: undefined,
      remoteUUID: undefined,
      documentArray: [],
      initBlocksOfCanvas: undefined,
      dragging: false,
      dragMode: false,
      zoom: 1,
      relativeX: 0,
      relativeY: 0,
      fileArray: [],
      initFile: undefined,
      blockComments: [],
      freeComments: [],
      currentComments: [],
      currentCommentType: 'block',
      currentBlockID: 0,
      blocks: [],
      dependBlocks: new Map(),
      initCommentBlocks: undefined,
      commentMode: false,
      documentBlockOfComment: undefined
    }
  },
  components: {
    DocumentBlock,
    UploadFile,
    CommentBlock
  },
  computed: {
    ...mapState({
      userID: state => state.Login.userID
    })
  },
  watch: {
    red: function (value) {
      this.canvas.freeDrawingBrush.color = this.getColor()
      this.$refs['detail-display-button'].style.backgroundColor = this.getColor()
    },
    green: function (value) {
      this.canvas.freeDrawingBrush.color = this.getColor()
      this.$refs['detail-display-button'].style.backgroundColor = this.getColor()
    },
    blue: function (value) {
      this.canvas.freeDrawingBrush.color = this.getColor()
      this.$refs['detail-display-button'].style.backgroundColor = this.getColor()
    },
    size: function (value) {
      this.canvas.freeDrawingBrush.width = this.size
      this.$refs['detail-display-button'].style.height = this.size + 'px'
    }
  },
  mounted () {
    this.uuid = uuid()
    this.remoteUUID = this.uuid
    this.initBlocksOfCanvas = new Map()
    this.initFile = new Map()
    this.initCommentBlocks = new Map()
    this.$io.emit('enterCanvas', this.conferenceID, this.userID)
    this.canvas = new fabric.Canvas('canvas')
    this.$io.on('receiveObjectOfCanvas', (object, remoteUUID, setOption) => {
      this.solveObjectOption(object, setOption)
      this.updateBoard(this.canvas, object, remoteUUID)
    })
    this.$io.on('initCanvas', (itemsOfCanvas, blocksOfCanvas, filesOfCanvas, blocks, blockComments, freeComments) => {
      for (const item of itemsOfCanvas) {
        this.updateBoard(this.canvas, item, 0)
      }
      for (const block of blocksOfCanvas) {
        this.documentArray.push(block.itemID)
        // 不直接更新位置是因为此时document-block未渲染完毕,无法根据id拿到它
        this.initBlocksOfCanvas.set(block.itemID, { left: block.itemLeft, top: block.itemTop, type: block.type, language: block.language, zoom: this.zoom })
      }
      for (const file of filesOfCanvas) {
        this.fileArray.push(file.fileID)
        this.initFile.set(file.fileID, { left: file.fileLeft, top: file.fileTop, fileContent: file.fileContent, zoom: this.zoom })
      }
      for (const block of blocks) {
        if (block.stickBlockID === null || block.stickBlockID === undefined) {
          this.blocks.push(block.commentBlockID)
          this.initCommentBlocks.set(block.commentBlockID, { left: block.left, top: block.top, commentBlockID: block.commentBlockID, conferenceID: block.conferenceID, stickBlockID: block.stickBlockID })
        } else {
          const object = this.initBlocksOfCanvas.get(block.stickBlockID)
          this.initBlocksOfCanvas.set(block.stickBlockID, { ...object, commentID: block.commentBlockID })
        }
      }
      for (let index = blockComments.length - 1; index >= 0; index--) {
        this.blockComments.push(blockComments[index])
      }
      for (let index = freeComments.length - 1; index >= 0; index--) {
        this.freeComments.push(freeComments[index])
      }
    })
    this.$io.on('shareViewInvitation', (params) => {
      const viewportTransform = params.viewportTransform
      this.relativeX = params.relativeX
      this.relativeY = params.relativeY
      const zoom = viewportTransform[0]
      const oldZoom = this.canvas.viewportTransform[0]
      this.zoom = zoom
      this.canvas.setZoom(zoom)
      for (let index = this.documentArray.length - 1; index >= 0; index--) {
        const docRef = 'doc' + this.documentArray[index]
        const documentComponent = this.$refs[docRef][0]
        const block = documentComponent.codeMirror
        const container = documentComponent.getContainer()
        const left = parseFloat(container.style.left)
        const top = parseFloat(container.style.top)
        container.style.left = zoom / oldZoom * left + 'px'
        container.style.top = zoom / oldZoom * top + 'px'
        container.style.fontSize = Math.ceil(14 * zoom) + 'px'
        block.setSize(400 * zoom, 400 * zoom)
      }
      for (let index = this.blocks.length - 1; index >= 0; index--) {
        const comment = this.getElementById('commentBlock' + this.blocks[index])
        const left = parseFloat(comment.style.left)
        const top = parseFloat(comment.style.top)
        comment.style.left = zoom / oldZoom * left + 'px'
        comment.style.top = zoom / oldZoom * top + 'px'
        comment.style.fontSize = Math.ceil(14 * zoom) + 'px'
      }
      for (let index = this.fileArray.length - 1; index >= 0; index--) {
        const fileItem = this.getElementById('pdf-wrapper' + this.fileArray[index])
        fileItem.style.width = parseFloat(fileItem.style.width) * zoom / oldZoom + 'px'
        fileItem.style.height = parseFloat(fileItem.style.height) * zoom / oldZoom + 'px'
        fileItem.style.left = zoom / oldZoom * parseFloat(fileItem.style.left) + 'px'
        fileItem.style.top = zoom / oldZoom * parseFloat(fileItem.style.top) + 'px'
      }
      const oldViewportTransform = this.canvas.viewportTransform

      this.canvas.viewportTransform = viewportTransform
      for (let index = this.documentArray.length - 1; index >= 0; index--) {
        const block = this.getElementById('docContainer' + this.documentArray[index])
        block.style.left = parseFloat(block.style.left) + viewportTransform[4] - oldViewportTransform[4] + 'px'
        block.style.top = parseFloat(block.style.top) + viewportTransform[5] - oldViewportTransform[5] + 'px'
      }
      for (let index = this.blocks.length - 1; index >= 0; index--) {
        const comment = this.getElementById('commentBlock' + this.blocks[index])
        comment.style.left = parseFloat(comment.style.left) + viewportTransform[4] - oldViewportTransform[4] + 'px'
        comment.style.top = parseFloat(comment.style.top) + viewportTransform[5] - oldViewportTransform[5] + 'px'
      }
      for (let index = this.fileArray.length - 1; index >= 0; index--) {
        const fileItem = this.getElementById('pdf-wrapper' + this.fileArray[index])
        fileItem.style.left = parseFloat(fileItem.style.left) + viewportTransform[4] - oldViewportTransform[4] + 'px'
        fileItem.style.top = parseFloat(fileItem.style.top) + viewportTransform[5] - oldViewportTransform[5] + 'px'
      }
      this.canvas.renderAll()
    })
    this.canvas.on('object:added', (option) => {
      this.objectChanged(option, 'added')
    })
    this.canvas.on('object:removed', (option) => {
      this.objectChanged(option, 'removed')
    })
    this.canvas.on('object:modified', (option) => {
      this.objectChanged(option, 'modified')
    })
    document.addEventListener('keydown', (event) => {
      let activeObjects
      switch (event.code) {
        case 'Delete':
        case 'Backspace':
          activeObjects = this.canvas.getActiveObjects()
          if (activeObjects) {
            for (const activeObject of activeObjects) {
              if (!activeObject.isEditing) {
                this.canvas.remove(activeObject)
              }
            }
            this.canvas.renderAll()
          }
          break
      }
    })
    // 移动缩放监听
    this.canvas.on({
      'mouse:down': (event) => {
        if (event.target === null && this.dragMode) {
          this.dragging = true
          this.canvas.selection = false
        }
      },
      'mouse:up': (event) => {
        if (this.dragging) {
          this.dragging = false
        }
        this.canvas.selection = true
      },
      'mouse:move': (event) => {
        if (this.dragging && event && event.e) {
          const delta = new fabric.Point(event.e.movementX, event.e.movementY)
          this.relativeX += event.e.movementX / this.zoom
          this.relativeY += event.e.movementY / this.zoom
          this.canvas.relativePan(delta)
          for (let index = this.documentArray.length - 1; index >= 0; index--) {
            const block = this.getElementById('docContainer' + this.documentArray[index])
            const left = block.style.left
            const top = block.style.top
            block.style.left = Number(left.substr(0, left.length - 2)) + event.e.movementX + 'px'
            block.style.top = Number(top.substr(0, top.length - 2)) + event.e.movementY + 'px'
          }
          for (let index = this.blocks.length - 1; index >= 0; index--) {
            const comment = this.getElementById('commentBlock' + this.blocks[index])
            const left = parseFloat(comment.style.left)
            const top = parseFloat(comment.style.top)
            comment.style.left = left + event.e.movementX + 'px'
            comment.style.top = top + event.e.movementY + 'px'
          }
          for (let index = this.fileArray.length - 1; index >= 0; index--) {
            const fileItem = this.getElementById('pdf-wrapper' + this.fileArray[index])
            const left = parseFloat(fileItem.style.left)
            const top = parseFloat(fileItem.style.top)
            fileItem.style.left = left + event.e.movementX + 'px'
            fileItem.style.top = top + event.e.movementY + 'px'
          }
        }
      },
      'mouse:wheel': (mouseEvent) => {
        mouseEvent.e.preventDefault()
        mouseEvent.e.stopPropagation()
        const oldZoom = this.canvas.getZoom()
        let zoom = (event.deltaY > 0 ? -0.1 : 0.1) + this.canvas.getZoom()
        zoom = Math.max(0.1, zoom)
        zoom = Math.min(10, zoom)
        this.zoom = zoom
        this.relativeX = mouseEvent.pointer.x / zoom - (mouseEvent.pointer.x - this.relativeX * oldZoom) / oldZoom
        this.relativeY = mouseEvent.pointer.y / zoom - (mouseEvent.pointer.y - this.relativeY * oldZoom) / oldZoom
        const zoomPoint = new fabric.Point(mouseEvent.pointer.x, mouseEvent.pointer.y)
        this.canvas.zoomToPoint(zoomPoint, zoom)
        for (let index = this.documentArray.length - 1; index >= 0; index--) {
          const docRef = 'doc' + this.documentArray[index]
          const documentComponent = this.$refs[docRef][0]
          const block = documentComponent.codeMirror
          let left = documentComponent.getContainer().style.left
          left = left === '0' ? 0 : Number(left.substr(0, left.length - 2))
          let top = documentComponent.getContainer().style.top
          top = top === '0' ? 0 : Number(top.substr(0, top.length - 2))
          documentComponent.getContainer().style.left = zoom / oldZoom * (left - mouseEvent.pointer.x) + mouseEvent.pointer.x + 'px'
          documentComponent.getContainer().style.top = zoom / oldZoom * (top - mouseEvent.pointer.y) + mouseEvent.pointer.y + 'px'
          block.setSize(400 * zoom, 400 * zoom)
          documentComponent.getContainer().style.fontSize = Math.ceil(14 * zoom) + 'px'
        }
        for (let index = this.blocks.length - 1; index >= 0; index--) {
          const comment = this.getElementById('commentBlock' + this.blocks[index])
          const left = parseFloat(comment.style.left)
          const top = parseFloat(comment.style.top)
          comment.style.left = zoom / oldZoom * (left - mouseEvent.pointer.x) + mouseEvent.pointer.x + 'px'
          comment.style.top = zoom / oldZoom * (top - mouseEvent.pointer.y) + mouseEvent.pointer.y + 'px'
          comment.style.fontSize = Math.ceil(14 * zoom) + 'px'
        }
        for (let index = this.fileArray.length - 1; index >= 0; index--) {
          const fileItem = this.getElementById('pdf-wrapper' + this.fileArray[index])
          const left = parseFloat(fileItem.style.left)
          const top = parseFloat(fileItem.style.top)
          fileItem.style.left = zoom / oldZoom * (left - mouseEvent.pointer.x) + mouseEvent.pointer.x + 'px'
          fileItem.style.top = zoom / oldZoom * (top - mouseEvent.pointer.y) + mouseEvent.pointer.y + 'px'
          fileItem.style.width = parseFloat(fileItem.style.width) * zoom / oldZoom + 'px'
          fileItem.style.height = parseFloat(fileItem.style.height) * zoom / oldZoom + 'px'
        }
      }
    })
    const that = this
    this.$io.on('newDocumentBlock', (params) => {
      that.documentArray.push(params.docID)
      this.initBlocksOfCanvas.set(params.docID, { left: (params.left + this.relativeX) * this.zoom, top: (params.top + this.relativeY) * this.zoom, type: params.type, language: params.language, zoom: this.zoom })
    })
    this.$io.on('moveDocumentBlock', (params) => {
      const targetDoc = this.$refs[`doc${params.docID}`][0].$el
      targetDoc.setAttribute('style', `position: absolute; left: ${(params.left + this.relativeX) * this.zoom}px; top: ${(params.top + this.relativeY) * this.zoom}px`)
    })
    this.$io.on('deleteDocumentBlock', (docID) => {
      that.documentArray.splice(that.documentArray.findIndex(document => document === docID), 1)
    })
    this.$io.on('newPdfFile', (params) => {
      that.fileArray.push(params.fileID)
      that.initFile.set(params.fileID, { left: (params.left + this.relativeX) * this.zoom, top: (params.top + this.relativeY) * this.zoom, fileContent: params.fileContent, zoom: this.zoom })
    })
    this.$io.on('moveFile', (params) => {
      const targetFile = that.$refs[`file${params.fileID}`][0].$el
      targetFile.style.postion = 'absolute'
      targetFile.style.left = (params.left + this.relativeX) * this.zoom + 'px'
      targetFile.style.top = (params.top + this.relativeY) * this.zoom + 'px'
    })
    this.$io.on('removeFile', (fileID) => {
      that.fileArray.splice(this.fileArray.findIndex(pdfFile => pdfFile === fileID), 1)
    })

    this.canvas.on({
      'mouse:down': (event) => {
        this.addCommentBlock(event)
      }
    })
    this.$io.on('newCommentBlock', (block) => {
      if (block.stickBlockID === null || block.stickBlockID === undefined) {
        this.blocks.push(block.commentBlockID)
        this.initCommentBlocks.set(block.commentBlockID, block)
      } else {
        const ref = 'doc' + block.stickBlockID
        this.$refs[ref][0].setComment(true)
        this.$refs[ref][0].setCommentID(block.commentBlockID)
      }
    })
    this.$io.on('newComment', (comment, type) => {
      if (type === 'free') {
        this.freeComments.push(comment)
      } else {
        this.blockComments.push(comment)
      }
      if (comment.commentBlockID === this.currentBlockID) {
        this.refresh(this.currentCommentType, this.currentBlockID)
      }
    })
    this.$io.on('deleteComment', (comment, type) => {
      if (type === 'block') {
        this.blockComments.splice(this.blockComments.findIndex(data => data.commentItemID === comment.commentItemID), 1)
      } else {
        this.freeComments.splice(this.freeComments.findIndex(data => data.commentItemID === comment.commentItemID), 1)
      }
      if (comment.commentBlockID === this.currentBlockID) {
        this.refresh(this.currentCommentType, this.currentBlockID)
      }
    })
    this.$io.on('deleteCommentBlock', (commentBlockID, type, documentBlockID) => {
      if (commentBlockID === this.currentBlockID) {
        this.$refs['comment-detail-container'].style.display = 'none'
      }
      if (type === 'free') {
        this.blocks.splice(this.blocks.findIndex(block => block === commentBlockID), 1)
      } else {
        const ref = 'doc' + documentBlockID
        this.$refs[ref][0].setComment(false)
      }
    })
  },
  methods: {
    addCommentBlock: function (event, stickBlockID) {
      if (!this.commentMode) {
        return
      }
      this.commentMode = false
      const ID = uuid()
      if (stickBlockID === null || stickBlockID === undefined) {
        this.$io.emit('addCommentBlock', { conferenceID: this.conferenceID, commentBlockID: ID, left: -this.relativeX + this.zoom * event.pointer.x, top: -this.relativeY + this.zoom * event.pointer.y })
      } else {
        this.$io.emit('addCommentBlock', { conferenceID: this.conferenceID, commentBlockID: ID, stickBlockID: stickBlockID, left: -this.relativeX + this.zoom * event.x, top: -this.relativeY + this.zoom * event.y })
      }
    },
    deleteCommentBlock: function (event) {
      if (this.currentCommentType === 'block') {
        const ref = 'doc' + this.documentBlockOfComment
        this.$refs[ref][0].setComment(false)
      }
      this.$refs['comment-detail-container'].style.display = 'none'
      this.$io.emit('deleteCommentBlock', this.currentBlockID, this.conferenceID)
    },
    revokeComment: function (commentID) {
      let comment
      if (this.currentCommentType === 'block') {
        comment = this.blockComments.find(data => data.commentItemID === commentID)
      } else {
        comment = this.freeComments.find(data => data.commentItemID === commentID)
      }
      this.$io.emit('revokeComment', this.currentCommentType, comment, this.conferenceID)
    },
    addComment: function () {
      const content = this.$refs['comment-input'].value
      const ID = uuid()
      this.$io.emit('addComment', {
        commentBlockID: this.currentBlockID,
        userID: localStorage.getItem('userID'),
        content: content,
        commentItemID: ID
      }, this.conferenceID)
    },
    displayComment: function (e, type, commentID, documentID) {
      if (type === 'block') {
        this.documentBlockOfComment = documentID
      }
      this.refresh(type, commentID)
      this.currentBlockID = commentID
      this.currentCommentType = type
      this.$refs['comment-detail-container'].style.display = 'block'
      this.$refs['comment-detail-container'].style.float = 'top'
      const commentBlock = document.getElementById('commentBlock' + commentID)
      commentBlock.setCommentContent(this.currentComments)
    },
    cancelComment: function () {
      this.$refs['comment-detail-container'].style.display = 'none'
    },
    refresh: function (type, blockID) {
      this.currentComments = []
      if (type === 'block') {
        for (let index = this.blockComments.length - 1; index >= 0; index--) {
          if (this.blockComments[index].commentBlockID === blockID) {
            this.currentComments.push(this.blockComments[index])
          }
        }
      } else {
        for (let index = this.freeComments.length - 1; index >= 0; index--) {
          if (this.freeComments[index].commentBlockID === blockID) {
            this.currentComments.push(this.freeComments[index])
          }
        }
      }
    },
    documentDrag: function (e, docDiv) {
      const disX = e.clientX - docDiv.offsetLeft
      const disY = e.clientY - docDiv.offsetTop
      document.onmousemove = (ev) => {
        const left = -this.relativeX + (ev.clientX - disX) / this.zoom
        const top = -this.relativeY + (ev.clientY - disY) / this.zoom
        docDiv.style.left = ev.clientX - disX + 'px'
        docDiv.style.top = ev.clientY - disY + 'px'
        this.$io.emit('moveDocumentBlock', { conferenceID: this.conferenceID, left: left, top: top, docID: docDiv.id.substr(12, docDiv.id.length - 12) })
      }
      // 避免频繁更新数据库
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
        this.$io.emit('dragBlockStop', { left: parseFloat(docDiv.style.left), top: parseFloat(docDiv.style.top), docID: docDiv.id.substr(12, docDiv.id.length - 12) })
      }
    },
    fileDrag: function (e, fileDiv) {
      console.log('fileDrag')
      const disX = e.clientX - fileDiv.offsetLeft
      const disY = e.clientY - fileDiv.offsetTop
      document.onmousemove = (ev) => {
        const left = -this.relativeX + (ev.clientX - disX) / this.zoom
        const top = -this.relativeY + (ev.clientY - disY) / this.zoom
        fileDiv.style.left = ev.clientX - disX + 'px'
        fileDiv.style.top = ev.clientY - disY + 'px'
        this.$io.emit('moveFile', { left: left, top: top, fileID: fileDiv.id.substr(11, fileDiv.id.length - 11), conferenceID: this.conferenceID })
      }
      // 避免频繁更新数据库
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
        console.log('dragFileStop', fileDiv.id, fileDiv.id.substr(11, fileDiv.id.length - 11))
        this.$io.emit('dragFileStop', { left: parseFloat(fileDiv.style.left), top: parseFloat(fileDiv.style.top), fileID: fileDiv.id.substr(11, fileDiv.id.length - 11) })
      }
    },
    getElementById: function (ID) {
      return document.getElementById(ID)
    },
    solveObjectOption: function (object, setOption) {
      if (setOption === undefined || setOption === null) {
        setOption = object
      }
      let isMultiActive = false
      let group
      const activeObjects = this.canvas.getActiveObjects()
      if (activeObjects && activeObjects.length > 1) {
        for (const activeObject of activeObjects) {
          if (activeObject.id === object.id) {
            isMultiActive = true
            group = activeObject.group
            break
          }
        }
      }
      if (isMultiActive) {
        const { addX, addY } = this.getPoint(group.width * group.scaleX / 2, group.height * group.scaleY / 2, group.angle)
        const X = (setOption.left - group.left - addX) / group.scaleX
        const Y = (setOption.top - group.top - addY) / group.scaleY
        const relativePoint = this.getPoint(X, Y, -group.angle)
        object.left = relativePoint.addX
        object.top = relativePoint.addY
        object.scaleX = setOption.scaleX / group.scaleX
        object.scaleY = setOption.scaleY / group.scaleY
        object.angle = setOption.angle - group.angle
      } else {
        object.left = setOption.left
        object.top = setOption.top
        object.scaleX = setOption.scaleX
        object.scaleY = setOption.scaleY
        object.angle = setOption.angle
      }
    },
    getPoint: function (X, Y, angle) {
      angle = angle * Math.PI / 180
      const newX = X * Math.cos(angle) - Y * Math.sin(angle)
      const newY = X * Math.sin(angle) + Y * Math.cos(angle)
      return {
        addX: newX,
        addY: newY
      }
    },
    getColor: function () {
      return '#' + ('000000' + (256 * 256 * this.red + 256 * this.green + this.blue).toString(16)).substr(-6)
    },
    getObjectById: function (canvas, id) {
      const currentObjects = canvas.getObjects()
      for (let index = currentObjects.length - 1; index >= 0; index--) {
        if (currentObjects[index].id === id) {
          return currentObjects[index]
        } else {
          if (currentObjects[index].id === undefined) {
            return currentObjects[index]
          }
        }
      }
      return null
    },
    updateBoard: function (canvas, object, remoteUUID) {
      if (remoteUUID === this.uuid) {
        return
      }
      const objectType = object.type
      const objectID = object.id
      const existing = this.getObjectById(canvas, objectID)
      if (object.state === 'removed') {
        if (existing) {
          canvas.remove(existing)
        }
        return
      }
      // 手动klass化clipPath
      if (object.clipPath) {
        const klass = fabric.util.getKlass(object.clipPath.type)
        if (klass) {
          klass.fromObject(object.clipPath, function (item) {
            object.clipPath = item
          })
        }
      }
      if (existing) {
        this.remoteUUID = remoteUUID
        existing.set(object)
        existing.setCoords()
        canvas.fire('object:modified', { target: object })
      } else {
        let fabricItem
        switch (objectType) {
          case 'rect':
            fabricItem = new fabric.Rect(object)
            break
          case 'circle':
            fabricItem = new fabric.Circle(object)
            break
          case 'triangle':
            fabricItem = new fabric.Triangle(object)
            break
          case 'path':
            fabricItem = new fabric.Path(object.path, object)
            break
          case 'i-text':
            fabricItem = new fabric.IText(object.text, object)
            break
          default: break
        }
        this.remoteUUID = remoteUUID
        fabricItem.set({ id: objectID })
        this.canvas.add(fabricItem)
      }
      canvas.renderAll()
    },
    objectChanged: function (options, state) {
      if (!options.target.id) {
        options.target.id = uuid()
        options.target.set({ strokeWidth: this.size })
        options.target.set({ stroke: this.getColor() })
      }
      if (this.remoteUUID === this.uuid) {
        if (state === 'modified' && options.target._objects !== undefined) {
          const activeObjects = this.canvas.getActiveObjects()
          const group = activeObjects[0].group
          const { addX, addY } = this.getPoint(group.width * group.scaleX / 2, group.height * group.scaleY / 2, group.angle)
          for (const activeObject of activeObjects) {
            const relativePoint = this.getPoint(activeObject.left, activeObject.top, group.angle)
            this.sendObjectToGroup(activeObject, state,
              {
                left: relativePoint.addX * group.scaleX + group.left + addX,
                top: relativePoint.addY * group.scaleY + group.top + addY,
                scaleX: activeObject.scaleX * group.scaleX,
                scaleY: activeObject.scaleY * group.scaleY,
                angle: activeObject.angle + group.angle
              })
          }
        } else {
          this.sendObjectToGroup(options.target, state)
        }
      } else {
        this.remoteUUID = this.uuid
      }
    },
    sendObjectToGroup: function (object, state, setOption) {
      if (object) {
        object.toJSON = (function (toJSON) {
          return function () {
            return fabric.util.object.extend(toJSON.call(this), {
              id: object.id,
              state: state
            })
          }
        })(object.toJSON)
        this.$io.emit('sendObjectOfCanvas', object, this.conferenceID, this.uuid, setOption)
      }
    },
    switchToComment: function () {
      this.commentMode = true
    },
    switchToCursor: function () {
      this.dragMode = false
      this.commentMode = false
      this.canvas.isDrawingMode = false
    },
    switchToDrag: function () {
      this.dragMode = true
      this.canvas.isDrawingMode = false
      this.commentMode = false
    },
    shareMyView: function (toWhomID) {
      this.$io.emit('shareMyView', toWhomID, {
        viewportTransform: this.canvas.viewportTransform,
        relativeX: this.relativeX,
        relativeY: this.relativeY
      })
    },
    switchToPen: function () {
      this.dragMode = false
      this.commentMode = false
      this.canvas.isDrawingMode = true
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas)
      this.canvas.freeDrawingBrush.width = this.size
      this.canvas.freeDrawingBrush.color = this.getColor()
    },
    switchToEraser: function () {
      this.dragMode = false
      this.commentMode = false
      this.canvas.isDrawingMode = true
      this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas)
      this.canvas.freeDrawingBrush.width = 4
    },
    addShape: function (event) {
      this.canvas.isDrawingMode = false
      const type = event.target.name
      let fabricItem
      if (type === 'rectangle') {
        fabricItem = new fabric.Rect({
          height: 75,
          width: 150,
          stroke: 'red',
          fill: null
        })
      } else if (type === 'triangle') {
        fabricItem = new fabric.Triangle({
          width: 100,
          height: 100,
          stroke: 'red',
          fill: null
        })
      } else if (type === 'circle') {
        fabricItem = new fabric.Circle({
          radius: 50,
          stroke: 'red',
          fill: null
        })
      } else if (type === 'itext') {
        fabricItem = new fabric.IText('Tap and Type', { left: 100, top: 100 })
        fabricItem.set({ erasable: false })
      }
      this.canvas.add(fabricItem)
      this.canvas.renderAll()
    },
    addDocumentBlock: function (type, language) {
      const docID = uuid()
      this.documentArray.push(docID)
      this.initBlocksOfCanvas.set(docID, { left: this.relativeX * this.zoom, top: this.relativeY * this.zoom, type: type, language: language, zoom: this.zoom })
      // 通知会议室里其他socket
      this.$io.emit('newDocumentBlock', { conferenceID: this.conferenceID, docID: docID, type: type, left: 0, top: 0, language: language })
    },
    removeDocumentBlock: function (docID) {
      this.documentArray.splice(this.documentArray.findIndex(document => document === docID), 1)
      this.$io.emit('deleteDocumentBlock', { conferenceID: this.conferenceID, docID: docID })
    },
    notifyMove: function (params) {
      this.$io.emit('moveDocumentBlock', { conferenceID: this.conferenceID, left: params.left, top: params.top, docID: params.docID })
    },
    notifyChangeLanguage: function (params) {
      this.$io.emit('changeLanguage', { conferenceID: this.conferenceID, language: params.language, docID: params.docID })
    },
    loadFileHandler: function () {
      const reader = new FileReader()
      const file = document.getElementById('file-selector').files[0]
      if (file) {
        reader.readAsDataURL(file)
        const that = this
        reader.onload = () => {
          const fileID = uuid()
          const fileContent = reader.result.split('base64,')[1] // base64码
          that.fileArray.push(fileID)
          console.log('loadFileHandler zoom', this.zoom)
          that.initFile.set(fileID, { left: this.relativeX * this.zoom, top: this.relativeY * this.zoom, fileContent: fileContent, zoom: this.zoom })
          that.$io.emit('newPdfFile', { conferenceID: that.conferenceID, fileContent: fileContent, fileID: fileID, left: 0, top: 0 })
        }
      }
    },
    removeFile: function (fileID) {
      this.fileArray.splice(this.fileArray.findIndex(pdfFile => pdfFile === fileID), 1)
      this.$io.emit('removeFile', { conferenceID: this.conferenceID, fileID: fileID })
    },
    clickFileSelector: function () {
      document.getElementById('file-selector').click()
    }
  }
}
</script>

<style scoped>
.body {
  width: 1200px;
  margin: 0 auto;
}

.options-container {
  min-height: 50px;
  height: auto;
}

.options-button {
  margin: 20px 10px;
}

.canvas-container {
  width: 1200px;
  height: 800px;
  margin: 20px auto;
  border: 1px solid #594b67;
  overflow: hidden;
  position: relative;
}

.options-container > div {
  display: inline-block;
  height: 50px;
}

.detail-options-container {
  width: 300px;
}

.detail-display-container > button {
  width: 30px;
  height: 3px;
  background-color: #000;
}

.document-block-container > div {
  z-index: 10000;
  position: absolute;
}

.file-container > div {
  z-index: 10000;
  position: absolute;
}

</style>

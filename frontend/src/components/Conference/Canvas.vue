<template>
  <div class="body">
    <div class="options-container">
      <div class="basic-options-container">
        <b-button variant="outline-primary"
                  class="options-button"
                  @click="switchToCursor">鼠标</b-button>
        <b-button variant="outline-primary"
                  class="options-button"
                  @click="switchToDrag">拖拽</b-button>
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
    <div class="canvas-container">
      <div class='document-block-container'>
        <document-block v-for="docID in documentArray"
                        @click="documentDrag"
                        :key="docID"
                        :identifier="docID"
                        :ref="'doc'+docID"
                        :init-params="initBlocksOfCanvas.get(docID)"
                        @remove="removeDocumentBlock"
                        @moveDocumentBlock="notifyMove">
        </document-block>
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
      initFile: undefined
    }
  },
  components: {
    DocumentBlock,
    UploadFile
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
    this.$io.emit('enterCanvas', this.conferenceID)
    this.canvas = new fabric.Canvas('canvas')
    this.$io.on('receiveObjectOfCanvas', (object, remoteUUID, setOption) => {
      this.solveObjectOption(object, setOption)
      this.updateBoard(this.canvas, object, remoteUUID)
    })
    this.$io.on('initCanvas', (itemsOfCanvas, blocksOfCanvas, filesOfCanvas) => {
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
        this.initFile.set(file.fileID, { left: file.fileLeft, top: file.fileTop, fileContent: file.fileContent })
      }
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
        this.dragging = false
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
        }
      },
      'mouse:wheel': (mouseEvent) => {
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
          let width = block.getWrapperElement().style.width
          width = width === '0' ? 0 : Number(width.substr(0, width.length - 2)) + 2
          let height = block.getWrapperElement().style.height
          height = height === '0' ? 0 : Number(height.substr(0, height.length - 2)) + 2
          let left = documentComponent.getContainer().style.left
          left = left === '0' ? 0 : Number(left.substr(0, left.length - 2))
          let top = documentComponent.getContainer().style.top
          top = top === '0' ? 0 : Number(top.substr(0, top.length - 2))
          documentComponent.getContainer().style.left = zoom / oldZoom * (left - mouseEvent.pointer.x) + mouseEvent.pointer.x + 'px'
          documentComponent.getContainer().style.top = zoom / oldZoom * (top - mouseEvent.pointer.y) + mouseEvent.pointer.y + 'px'
          block.setSize(400 * zoom, 400 * zoom)
          documentComponent.getContainer().style.fontSize = Math.ceil(14 * zoom) + 'px'
        }
      }
    })
    const that = this
    this.$io.on('newDocumentBlock', (params) => {
      that.documentArray.push(params.docID)
      this.initBlocksOfCanvas.set(params.docID, { left: (params.left + this.relativeX) * this.zoom, top: (params.top + this.relativeY) * this.zoom, type: params.type, language: 'javascript', zoom: this.zoom })
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
      that.initFile.set(params.fileID, { left: 0, top: 0, fileContent: params.fileContent })
    })
    this.$io.on('moveFile', (params) => {
      const targetFile = that.$refs[`file${params.fileID}`][0].$el
      targetFile.style.postion = 'absolute'
      targetFile.style.left = params.left + 'px'
      targetFile.style.top = params.top + 'px'
    })
    this.$io.on('removeFile', (fileID) => {
      that.fileArray.splice(this.fileArray.findIndex(pdfFile => pdfFile === fileID), 1)
    })
  },
  methods: {
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
        this.$io.emit('dragBlockStop', { left: parseInt(docDiv.style.left), top: parseInt(docDiv.style.top), docID: docDiv.id.substr(12, docDiv.id.length - 12) })
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
    switchToCursor: function () {
      this.dragMode = false
      this.canvas.isDrawingMode = false
    },
    switchToDrag: function () {
      this.dragMode = true
    },
    switchToPen: function () {
      this.dragMode = false
      this.canvas.isDrawingMode = true
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas)
      this.canvas.freeDrawingBrush.width = this.size
      this.canvas.freeDrawingBrush.color = this.getColor()
    },
    switchToEraser: function () {
      this.dragMode = false
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
      this.$io.emit('newDocumentBlock', { conferenceID: this.conferenceID, docID: docID, type: type, left: 0, top: 0 })
      if (language !== undefined && language !== null) {
        this.$io.emit('changeLanguage', { conferenceID: this.conferenceID, language: language, docID: docID })
      }
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
        reader.onload = function () {
          const fileID = uuid()
          const fileContent = reader.result.split('base64,')[1] // base64码
          that.fileArray.push(fileID)
          that.initFile.set(fileID, { left: 0, top: 0, fileContent: fileContent })
          that.$io.emit('newPdfFile', { conferenceID: that.conferenceID, fileContent: fileContent, fileID: fileID })
        }
      }
    },
    notifyMoveFile: function (params) {
      this.$io.emit('moveFile', { conferenceID: this.conferenceID, left: params.left, top: params.top, fileID: params.fileID })
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
</style>

<template>
  <div class="body">
    <div class="options-container">
      <b-button variant="outline-primary" class="options-button" @click="switchToCursor">鼠标</b-button>
      <b-button variant="outline-primary" class="options-button" @click="switchToEraser">橡皮擦</b-button>
      <b-button variant="outline-primary" class="options-button" @click="switchToPen">画笔</b-button>
      <b-button variant="outline-primary" name="rectangle" class="options-button" @click="addShape">矩形</b-button>
      <b-button variant="outline-primary" name="circle" class="options-button" @click="addShape">圆形</b-button>
      <b-button variant="outline-primary" name="triangle" class="options-button" @click="addShape">三角形</b-button>
      <b-button variant="outline-primary" name="itext" class="options-button" @click="addShape">文本</b-button>
    </div>
    <div class="canvas-container">
      <canvas id="canvas" width="1200" height="800"></canvas>
    </div>
  </div>
</template>

<script>
import { fabric } from 'fabric'
import { v1 as uuid } from 'uuid'
export default {
  name: 'Canvas',
  data: function () {
    return {
      canvas: undefined,
      conferenceID: 1,
      uuid: undefined,
      remoteUUID: undefined
    }
  },
  mounted () {
    this.uuid = uuid()
    this.remoteUUID = this.uuid
    this.$io.emit('enterCanvas', this.conferenceID)
    this.canvas = new fabric.Canvas('canvas')
    this.$io.on('receiveObjectOfCanvas', (object, remoteUUID) => {
      this.updateBoard(this.canvas, object, remoteUUID)
    })
    this.$io.on('initCanvas', (itemsOfCanvas) => {
      for (const item of itemsOfCanvas) {
        this.updateBoard(this.canvas, item, 0)
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
  },
  methods: {
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
      if (existing) {
        this.remoteUUID = remoteUUID
        existing.set(object)
        existing.setCoords()
        canvas.fire('object:modified', { target: object })
      } else {
        let fabricItem, path, pathResult
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
            path = object.path
            pathResult = []
            for (const smallPath of path) {
              pathResult = pathResult.concat(smallPath)
            }
            path = pathResult.join(' ')
            fabricItem = new fabric.Path(path)
            fabricItem.set({ fill: false })
            fabricItem.set({ stroke: object.stroke })
            break
          case 'i-text':
            fabricItem = new fabric.IText(object.text, object)
            break
          default:break
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
      }
      if (this.remoteUUID === this.uuid) {
        this.sendObjectToGroup(options.target, state)
      } else {
        this.remoteUUID = this.uuid
      }
    },
    sendObjectToGroup: function (object, state) {
      if (object) {
        object.toJSON = (function (toJSON) {
          return function () {
            return fabric.util.object.extend(toJSON.call(this), {
              id: object.id,
              state: state
            })
          }
        })(object.toJSON)
        this.$io.emit('sendObjectOfCanvas', object, this.conferenceID, this.uuid)
      }
    },
    switchToCursor: function () {
      this.canvas.isDrawingMode = false
    },
    switchToPen: function () {
      this.canvas.isDrawingMode = true
    },
    switchToEraser: function () {
      return null
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
      }
      this.canvas.add(fabricItem)
      this.canvas.renderAll()
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
  height: 50px;
}

.options-button {
  margin: 20px 10px;
}

.canvas-container {
  width: 1200px;
  height: 800px;
  margin: 20px auto;
  border: 1px solid #594b67;
}

</style>

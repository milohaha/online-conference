<template>
  <div class="body">
    <div class="options-container">
      <b-button variant="outline-primary" class="options-button" @click="switchToCursor">鼠标</b-button>
      <b-button variant="outline-primary" class="options-button" @click="switchToEraser">橡皮擦</b-button>
      <b-button variant="outline-primary" class="options-button" @click="switchToPen">画笔</b-button>
      <b-button variant="outline-primary" name="rectangle" class="options-button" @click="addShape">矩形</b-button>
      <b-button variant="outline-primary" name="circle" class="options-button" @click="addShape">圆形</b-button>
      <b-button variant="outline-primary" name="triangle" class="options-button" @click="addShape">三角形</b-button>
      <b-button variant="outline-primary" name="text" class="options-button" @click="addText">文本</b-button>
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
      uuid: undefined,
      conferenceID: 0
    }
  },
  mounted () {
    this.$io.emit('enterConference', this.conferenceID)
    this.uuid = uuid()
    this.canvas = new fabric.Canvas('canvas')
    this.$io.on('receiveObjectOfCanvas', (object, id) => {
      this.updateBoard(this.canvas, object, id)
    })
    this.canvas.on('object:added', this.sendObjectToGroup)
    this.canvas.on('object:removed', this.sendObjectToGroup)
    this.canvas.on('object:modified', this.sendObjectToGroup)
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
    updateBoard: function (canvas, object, uuid) {
      let objectType, objectID
      const objectStroke = object.stroke
      if (object.id === undefined) {
        object = object.path
        let result = []
        for (const smallPath of object) {
          result = result.concat(smallPath)
        }
        object = result.join(' ')
        objectID = uuid
        objectType = 'path'
      } else {
        objectType = object.type
        objectID = object.id
      }
      const existing = this.getObjectById(canvas, objectID)
      if (object.removed) {
        if (existing) {
          canvas.remove(existing)
        }
        return
      }
      if (existing) {
        existing.set(object)
        existing.setCoords()
      } else {
        let fabricItem
        switch (objectType) {
          case 'rect':
            canvas.add(new fabric.Rect(object))
            break
          case 'circle':
            canvas.add(new fabric.Circle(object))
            break
          case 'triangle':
            canvas.add(new fabric.Triangle(object))
            break
          case 'path':
            if (object.id === undefined) {
              fabricItem = new fabric.Path(object)
              fabricItem.set({ id: objectID })
              fabricItem.set({ fill: false })
              fabricItem.set({ stroke: objectStroke })
              canvas.add(fabricItem)
            } else {
              canvas.add(new fabric.Path(object))
            }
            break
          default:break
        }
      }
      canvas.renderAll()
    },
    sendObjectToGroup: function (options) {
      let id
      if (!options.target.id) {
        id = uuid()
      }
      if (options.target) {
        const object = options.target
        object.toJSON = (function (toJSON) {
          return function () {
            return fabric.util.object.extend(toJSON.call(this), {
              id: object.id
            })
          }
        })(object.toJSON)
        this.$io.emit('sendObjectOfCanvas', object, this.conferenceID, id)
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
        fabricItem = new fabric.IText('Enter text here...',
          { fontSize: 16, left: 20, top: 20, radius: 10 })
      }
      fabricItem.set({ id: uuid() })
      this.canvas.add(fabricItem)
      this.canvas.renderAll()
    },
    addText: function () {
      this.canvas.isDrawingMode = false
      const text = new fabric.Text('hello world, u cant edit me', { left: 100, top: 100 })
      const iText = new fabric.IText('Tap and Type', { left: 100, top: 300 })
      this.canvas.add(text)
      this.canvas.add(iText)
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

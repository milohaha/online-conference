<template>
  <div class="body">
    <div class="options-container">
      <b-button variant="outline-primary" class="options-button" @click="switchToCursor">鼠标</b-button>
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
      canvas: undefined
    }
  },
  mounted () {
    this.canvas = new fabric.Canvas('canvas')
    const rect = new fabric.Rect({
      top: 600,
      left: 100,
      width: 60,
      height: 70,
      fill: 'red'
    })
    this.canvas.add(rect)
  },
  methods: {
    switchToCursor: function () {
      this.canvas.isDrawingMode = false
    },
    switchToPen: function () {
      this.canvas.isDrawingMode = true
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
        console.log('rectangle')
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

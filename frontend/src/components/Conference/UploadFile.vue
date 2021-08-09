<template>
  <div style="position: absolute; left: 0; top: 0;"
       :id="'pdf-wrapper'+identifier"
       @mousedown="dragOrDelete">
  </div>
</template>

<script>
import PDFJS from 'pdfjs-dist'
import Vue from 'vue'

export default {
  name: 'uploadFile',
  data () {
    return {
      scale: 5 // 根据需要调整大小
    }
  },
  props: {
    identifier: String,
    initParams: Object
  },
  mounted () {
    console.log(this.initParams)
    // initialize position
    const pdfWrapper = document.getElementById(`pdf-wrapper${this.identifier}`)
    pdfWrapper.style.left = this.initParams.left + 'px'
    pdfWrapper.style.top = this.initParams.top + 'px'
    this.showPdf(this.initParams.fileContent)
  },
  methods: {
    async showPdf (fileContent) {
      const pdfWrapper = document.getElementById(`pdf-wrapper${this.identifier}`)
      const decodedPdf = atob(fileContent) // 解码
      const pdf = await PDFJS.getDocument({ data: decodedPdf })
      const numPages = pdf.numPages
      for (let i = 1; i < numPages; i++) {
        const pdfCanvas = document.createElement('canvas')
        const page = await pdf.getPage(i)
        const scale = 1
        const viewport = page.getViewport(scale)
        const context = pdfCanvas.getContext('2d')
        pdfCanvas.height = viewport.height
        pdfCanvas.width = viewport.width
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        }
        await page.render(renderContext)
        pdfWrapper.appendChild(pdfCanvas)

        // 缩放(避免模糊)
        pdfCanvas.style.width = '100%'
        pdfWrapper.style.width = Math.floor(viewport.width / this.scale) + 'px'
        pdfWrapper.style.height = Math.floor(viewport.height / this.scale) + 'px'
      }
    },
    dragOrDelete (e) {
      const pdfDiv = document.getElementById(`pdf-wrapper${this.identifier}`)
      const disX = e.clientX - pdfDiv.offsetLeft
      const disY = e.clientY - pdfDiv.offsetTop
      document.onmousemove = (ev) => {
        const left = ev.clientX - disX
        const top = ev.clientY - disY
        pdfDiv.style.left = left + 'px'
        pdfDiv.style.top = top + 'px'
        this.$emit('moveFile', { left: left, top: top, fileID: this.identifier })
      }
      document.onmouseup = (ev) => {
        document.onmousemove = null
        document.onmouseup = null
        document.onkeydown = null
        Vue.prototype.$io.emit('dragFileStop', { left: parseInt(pdfDiv.style.left), top: parseInt(pdfDiv.style.top), fileID: this.identifier })
      }
      // 选中并按键 则删除
      document.onkeydown = (ev) => {
        if (ev.code === 'Delete' || ev.code === 'Backspace') {
          this.$emit('remove', this.identifier)
        }
      }
    }
  }
}
</script>

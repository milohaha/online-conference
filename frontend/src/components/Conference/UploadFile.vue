<template>
  <div
    :id="'pdf-wrapper'+identifier"
    class="pdf-wrapper"
    @mousedown="mouseDown"
    @dblclick="$emit('remove',identifier)"
  >
  </div>
</template>

<script>
import PDFJS from 'pdfjs-dist'
export default {
  name: 'uploadFile',
  data () {
    return {
      scale: 5,
      zoom: undefined
    }
  },
  props: {
    identifier: String,
    initParams: Object
  },
  mounted () {
    const pdfWrapper = document.getElementById(`pdf-wrapper${this.identifier}`)
    pdfWrapper.style.left = this.initParams.left + 'px'
    pdfWrapper.style.top = this.initParams.top + 'px'
    this.zoom = this.initParams.zoom
    this.showPdf(this.initParams.fileContent)
  },
  methods: {
    mouseDown (event) {
      this.$emit('mousedown', event, document.getElementById(`pdf-wrapper${this.identifier}`))
    },
    async showPdf (fileContent) {
      const pdfWrapper = document.getElementById(`pdf-wrapper${this.identifier}`)
      const decodedPdf = Buffer.from(fileContent, 'base64')
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
        pdfCanvas.style.width = '100%'
        pdfWrapper.style.width = Math.floor(viewport.width / this.scale) * this.zoom + 'px'
        pdfWrapper.style.height = Math.floor(viewport.height / this.scale) * this.zoom + 'px'
      }
    }
  }
}
</script>
<style scoped>
.pdf-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
}
</style>

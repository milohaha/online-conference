<template>
  <div>
    <div class="canvas-container">
      <canvas id="canvas" width="1800px" height="1200px"></canvas>
    </div>
    <div class="left-top">
      <b-container fluid="md" class="text-center container">
        <b-row>
          <b-col align-self="center" cols="5">
            <logo logo-color="black"/>
          </b-col>
          <b-col align-self="center" class="conference-name" cols="5">
            <b-link
              @click="$bvModal.show('bv-modal-conference-information')">
              {{ conferenceName }}
            </b-link>
          </b-col>
          <b-col align-self="center" cols="2">
            <b-button>
              <span class="fmtfont fmt-share1"></span>
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div class="right-top">
      <b-button>分享</b-button>
      <notification id="notification"></notification>
      <b-dropdown no-caret right>
        <template #button-content>
          <span class="fmtfont fmt-setting"></span>
        </template>
        <b-dropdown-item @click="exitConference">
          <span class="fmtfont fmt-exit1"></span>
          退出会议室
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="top-center">
      <b-dropdown no-caret right>
        <template #button-content>
          <span class="fmtfont fmt-user1"></span>
        </template>
      </b-dropdown>
      <b-button v-b-toggle.member-list>
        <span class="fmtfont fmt-userlist"></span>
      </b-button>
    </div>
    <div class="left-center">
      <b-button-group vertical>
        <!--          鼠标-->
        <b-button class="fmtfont fmt-mouse" @click="switchToCursor">
        </b-button>
        <!--        笔-->
        <b-button class="fmtfont fmt-pen" @click="switchToPen">
        </b-button>

        <b-dropdown no-caret dropright id="shape">
          <!--            图形-->
          <template #button-content>
            <span class="fmtfont fmt-shape"></span>
          </template>
          <!--            矩形-->
          <b-dropdown-item-button name="rectangle" @click="addShape" button-class="fmtfont fmt-square">
          </b-dropdown-item-button>
          <!--            圆-->
          <b-dropdown-item-button name="circle" @click="addShape" button-class="fmtfont fmt-circle">
          </b-dropdown-item-button>
          <!--            三角形-->
          <b-dropdown-item-button name="triangle" @click="addShape" button-class="fmtfont fmt-triangle">
          </b-dropdown-item-button>
        </b-dropdown>
        <!--          文本-->
        <b-button name="itext" @click="addShape" class="fmtfont fmt-text">
        </b-button>
        <!--          橡皮擦-->
        <b-button @click="switchToEraser" class="fmtfont fmt-erase">
        </b-button>
        <!--          箭头-->
        <b-button class="fmtfont fmt-arrow">
        </b-button>
        <!--          注释-->
        <b-button class="fmtfont fmt-notation">
        </b-button>
        <!--          思维导图-->
        <b-button class="fmtfont fmt-mindmap">
        </b-button>
      </b-button-group>
    </div>
    <div class="left-bottom">
      <b-button-group>
        <b-button>
          <!--        视频-->
          <span class="fmtfont fmt-video"></span>
        </b-button>
        <!--        代码块-->
        <b-button
          class="fmtfont fmt-codeblock">
        </b-button>
        <!--        文档-->
        <b-button
          class="fmtfont fmt-document"
          @click="addDocumentBlock">
        </b-button>
      </b-button-group>
    </div>
    <div class="right-bottom">
      <div class="detail-options-container">
        <vs-slider v-model="red" color="red" max="255"></vs-slider>
        <vs-slider v-model="green" color="green" max="255"></vs-slider>
        <vs-slider v-model="blue" color="blue" max="255"></vs-slider>
        <vs-slider v-model="size" color="black" max="20"></vs-slider>
      </div>
      <div class="detail-display-container">
        <button ref="detail-display-button" disabled></button>
      </div>
    </div>
    <b-sidebar
      id="member-list"
      right
      shadow="true">
      <template #header>
        成员列表
      </template>
      <template #footer="{ hide }">
        <b-button @click="hide">关闭</b-button>
      </template>
      <member-list
        groupType="Conference"
      ></member-list>
    </b-sidebar>
    <conference-information
      :conferenceInformation="conferenceInformation"
      :conferenceID="conferenceID"
      :isFounder="founderID === userID">
    </conference-information>
    <div class='document-block-container'>
      <document-block v-for="docID in documentArray"
                      :key="docID"
                      :identifier="docID"
                      :ref="'doc'+docID"
                      :init-position="initBlocksOfCanvas.get(docID)"
                      @remove="removeDocumentBlock"
                      @moveDocumentBlock="notifyMove">
      </document-block>
    </div>
  </div>
</template>
<script>
import Logo from '../../components/PublicComponents/Logos/Logo.vue'
import Notification from '../../components/PublicComponents/Notice/Notification.vue'
import MemberList from '../../components/Team/MemberList.vue'
import ConferenceInformation from '../../components/Team/ConferenceInformation'
import { mapState } from 'vuex'
import Api from '../../api'
import { fabric } from 'fabric'
import '../../components/Conference/eraser_brush.mixin'
import { v1 as uuid } from 'uuid'
import DocumentBlock from '../../components/Conference/DocumentBlock'
export default {
  data: function () {
    return {
      red: 0,
      green: 0,
      blue: 0,
      size: 3,
      conferenceInformation: {},
      conferenceName: '',
      conferenceID: 0,
      founderID: 0,
      canvas: undefined,
      uuid: undefined,
      remoteUUID: undefined,
      documentArray: [],
      initBlocksOfCanvas: undefined
    }
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
  created () {
    this.conferenceID = parseInt(localStorage.getItem('conferenceID'))
    Api.getObjects({
      model: 'Conference',
      condition: { id: this.conferenceID }
    })
      .then(response => {
        this.founderID = response.data.objects[0].founderID
        this.conferenceName = response.data.objects[0].conferenceName
        this.conferenceInformation = response.data.objects[0]
      })
  },
  mounted () {
    this.uuid = uuid()
    this.remoteUUID = this.uuid
    this.initBlocksOfCanvas = new Map()
    this.$io.emit('enterCanvas', this.conferenceID)
    this.canvas = new fabric.Canvas('canvas')
    this.$io.on('receiveObjectOfCanvas', (object, remoteUUID, setOption) => {
      this.solveObjectOption(object, setOption)
      this.updateBoard(this.canvas, object, remoteUUID)
    })
    this.$io.on('initCanvas', (itemsOfCanvas, blocksOfCanvas) => {
      for (const item of itemsOfCanvas) {
        this.updateBoard(this.canvas, item, 0)
      }
      for (const block of blocksOfCanvas) {
        this.documentArray.push(block.itemID)
        // 不直接更新位置是因为此时document-block未渲染完毕,无法根据id拿到它
        this.initBlocksOfCanvas.set(block.itemID, { left: block.itemLeft, top: block.itemTop })
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

    const that = this
    this.$io.on('newDocumentBlock', (docID) => {
      that.documentArray.push(docID)
    })
    this.$io.on('moveDocumentBlock', (params) => {
      const targetDoc = this.$refs[`doc${params.docID}`][0].$el
      targetDoc.setAttribute('style', `position: absolute; left: ${params.left}px; top: ${params.top}px`)
    })
    this.$io.on('deleteDocumentBlock', (docID) => {
      that.documentArray.splice(that.documentArray.findIndex(document => document === docID), 1)
    })
  },
  methods: {
    updateMemberList () {
      this.$refs.memberList.getActiveMembers()
    },
    exitConference () {
      this.$io.emit('exitConference',
        this.userID,
        this.conferenceID)
      this.$router.push({ path: '/team/teamofuser' })
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
            fabricItem.set({ strokeWidth: object.strokeWidth })
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
      this.canvas.isDrawingMode = false
    },
    switchToPen: function () {
      this.canvas.isDrawingMode = true
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas)
      this.canvas.freeDrawingBrush.width = this.size
      this.canvas.freeDrawingBrush.color = this.getColor()
    },
    switchToEraser: function () {
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
    addDocumentBlock: function () {
      const docID = uuid()
      this.documentArray.push(docID)
      // 通知会议室里其他socket
      this.$io.emit('newDocumentBlock', { conferenceID: this.conferenceID, docID: docID })
    },
    removeDocumentBlock: function (docID) {
      this.documentArray.splice(this.documentArray.findIndex(document => document === docID), 1)
      this.$io.emit('deleteDocumentBlock', { conferenceID: this.conferenceID, docID: docID })
    },
    notifyMove: function (params) {
      this.$io.emit('moveDocumentBlock', { conferenceID: this.conferenceID, left: params.left, top: params.top, docID: params.docID })
    }
  },
  components: {
    Logo,
    Notification,
    MemberList,
    ConferenceInformation,
    DocumentBlock
  }
}
</script>
<style scoped>
.left-top {
  background-color: #eee;
  position: fixed;
  top: 5px;
  left: 10px;
}

.left-center {
  background-color: #eee;
  position: fixed;
  top: 25%;
}

.left-bottom {
  background-color: #eee;
  position: fixed;
  bottom: 5px;
  left: 10px;
}

.right-top {
  background-color: #eee;
  position: fixed;
  top: 5px;
  right: 10px;
}

.right-bottom {
  background-color: #eee;
  position: fixed;
  right: 10px;
  bottom: 5px;
}

.top-center {
  background-color: #eee;
  position: fixed;
  right: 200px;
  top: 5px;
}

.container {
  width: 400px;
}

.conference-name {
  border-left: #7f7f7f solid 1px;
  border-right: #7f7f7f solid 1px;
}

#shape {
  width: 50px;
}
</style>

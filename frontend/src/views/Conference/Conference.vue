<template>
<div>
  <div v-if="isValid">
    <div class="canvas-container">
      <canvas id="canvas" width="1800px" height="1200px"></canvas>
    </div>
    <div class="left-top">
      <div class="d-flex align-items-center logo-bar">
          <div class="px-3 py-2 flex-fill logo">
            <logo v-if="false" logo-color="black"/>
            <span>FMT</span>
          </div>
          <div
            class="conference-name px-3 flex-fill"
            v-b-popover.hover.bottom="'会议室信息'">
            <b-link
              class="conference-name-link"
              @click="$bvModal.show('bv-modal-conference-information')">
              {{ conferenceName }}
            </b-link>
          </div>
          <div class="px-3 py-2 flex-fill" v-b-popover.hover.rightbottom="'导出文件'">
            <span class="fmtfont fmt-share"></span>
          </div>
      </div>

    </div>
    <div class="right-top-center d-flex">
      <div class="top-center mx-4">
      <b-button-group class="user-list">
        <b-dropdown
          no-caret
          right
          variant="light"
          v-b-popover.hover.bottomleft="'共享视角'">
          <template #button-content>
            <span class="fmtfont fmt-user"></span>
          </template>
          <b-dropdown-item>给全员共享视角</b-dropdown-item>
          <b-dd-divider></b-dd-divider>
          <b-dropdown-item>共享视角给...</b-dropdown-item>
        </b-dropdown>
        <b-button
          @click="updateMemberList"
          v-b-toggle.member-list
          class="fmtfont fmt-userlist"
          variant="light"
          v-b-popover.hover.bottomleft="'会议室成员列表'">
        </b-button>
      </b-button-group>

    </div>
      <div class="right-top">
        <b-button-group class="setting-toolbar">
          <div class="d-flex align-items-center">
            <b-button
              id="copyURL"
              @click="shareConference"
              pill
              variant="primary"
              class="px-3 mx-2"
            >分享</b-button>
            <b-tooltip target="copyURL" triggers="hover">
              复制会议室链接
            </b-tooltip>
            <b-tooltip target="copyURL" ref="copySuccess" triggers="click">
              {{ copyNotice }}
            </b-tooltip>
          </div>
          <notification id="notification" v-b-popover.hover.bottomright="'通知'"></notification>
          <b-dropdown no-caret right variant="light" v-b-popover.hover.bottomright="'设置'">
            <template #button-content>
              <span class="fmtfont fmt-setting"></span>
            </template>
            <b-dropdown-item @click="exitConference">
              <span class="fmtfont fmt-exit mx-2"></span>
              退出会议室
            </b-dropdown-item>
          </b-dropdown>
        </b-button-group>
      </div>
    </div>
    <div class="left-center">
      <b-button-group vertical class="button-toolbar">
        <!--          鼠标-->
        <b-button
          class="fmtfont fmt-mouse"
          variant="light"
          v-b-popover.hover.right="'鼠标'"
          @click="switchToCursor">
        </b-button>
        <!--        笔-->
        <b-button
          class="fmtfont fmt-pen"
          variant="light"
          @click="switchToPen"
          v-b-popover.hover.right="'画笔'">
        </b-button>

        <b-dropdown
          no-caret
          variant="light"
          dropright
          v-b-popover.hover.right="'图形'"
          menu-class="dropdown-shape"
        >
          <!--            图形-->
          <template #button-content>
            <span class="fmtfont fmt-setting"></span>
          </template>
          <!--            矩形-->
          <b-dropdown-item-button
            style="width: 50px;"
            name="rectangle"
            @click="addShape"
            button-class="fmtfont fmt-rectangle"
            v-b-popover.hover.right="'矩形'">
          </b-dropdown-item-button>
          <!--            圆-->
          <b-dropdown-item-button
            style="width: 50px;"
            name="circle"
            @click="addShape"
            button-class="fmtfont fmt-circle"
            v-b-popover.hover.right="'圆'">
          </b-dropdown-item-button>
          <!--            三角形-->
          <b-dropdown-item-button
            style="width: 50px;"
            name="triangle"
            @click="addShape"
            button-class="fmtfont fmt-triangle"
            v-b-popover.hover.right="'三角形'">
          </b-dropdown-item-button>
        </b-dropdown>
        <!--          文本-->
        <b-button
          name="itext"
          @click="addShape"
          variant="light"
          class="fmtfont fmt-text"
          v-b-popover.hover.right="'文本'">
        </b-button>
        <!--          橡皮擦-->
        <b-button
          @click="switchToEraser"
          class="fmtfont fmt-eraser"
          variant="light"
          v-b-popover.hover.right="'橡皮擦'">
        </b-button>
        <!--          箭头-->
        <b-button
          class="fmtfont fmt-arrow"
          variant="light"
          v-b-popover.hover.right="'箭头'">
        </b-button>
        <!--          注释-->
        <b-button
          class="fmtfont fmt-comment"
          variant="light"
          v-b-popover.hover.right="'注释'">
        </b-button>
        <!--          思维导图-->
        <b-button
          class="fmtfont fmt-mindmap"
          variant="light"
          v-b-popover.hover.right="'思维导图'">
        </b-button>
      </b-button-group>
    </div>
    <div class="left-bottom">
      <b-button-group
        class="extra-button-toolbar">
        <!--        视频-->
        <b-button
          class="fmtfont fmt-video"
          variant="light"
          v-b-popover.hover.top="'多人音视频'">
        </b-button>
        <!--        代码块-->
        <b-button
          class="fmtfont fmt-codeblock"
          variant="light"
          v-b-popover.hover.top="'协同编辑代码'">
        </b-button>
        <!--        文档-->
        <b-button
          class="fmtfont fmt-document"
          @click="addDocumentBlock"
          variant="light"
          v-b-popover.hover.top="'协同编辑文档'">
        </b-button>
      </b-button-group>
    </div>
    <div class="right-bottom-center d-flex justify-content-between">
      <div class="bottom-center mx-5">
        <div class="detail-options-container" ref="lineHeight">
          <vs-slider
            v-model="size"
            color="black"
            max="20"
            @change="toggleLineHeight"></vs-slider>
        </div>
      </div>
      <div class="right-bottom m-lg-2">
        <div
          class="color-container"
          ref="colorContainer">
          <color-panel
            class="color-picker"
            v-model="color"
            v-if="displayPicker"></color-panel>
          <span
            class="current-color"
            v-b-popover.hover.top="'调色盘'"
            :style="'background-color: ' + color"
            @click="togglePicker"></span>
        </div>
      </div>
    </div>
    <div
      v-if="displayLineHeight"
      class="detail-display-container">
    </div>
    <div
    class="detail-line-height"
    v-if="displayLineHeight"
    :style="{'width':size+'px',
    'height':size+'px',
    'background-color':color,
    'margin-top':-size/2+'px',
    'margin-left':-size/2+'px'}">
  </div>
    <b-sidebar
      id="member-list"
      right
      backdrop
      width="500px"
      shadow="true">
      <template #header>
        成员列表
      </template>
      <member-list
        groupType="Conference"
        ref="memberList"
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
  <div v-if="!isValid" class="invalid-token">
    <p>链接已失效</p>
    <img src="../../assets/picture/error404.png" alt="链接失效">
  </div>
</div>
</template>
<script>
import Logo from '../../components/PublicComponents/Logos/Logo.vue'
import Notification from '../../components/PublicComponents/Notice/Notification.vue'
import MemberList from '../../components/Team/ConferenceMemberList.vue'
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
      size: 3,
      color: '#111111',
      displayPicker: false,
      displayLineHeight: false,
      conferenceInformation: {},
      conferenceName: '',
      founderID: 0,
      canvas: undefined,
      uuid: undefined,
      remoteUUID: undefined,
      documentArray: [],
      initBlocksOfCanvas: undefined,
      copyNotice: '',
      URL: '',
      isValid: true,
      isVisitor: ''
    }
  },
  computed: {
    ...mapState({
      userID: state => state.Login.userID,
      teamID: state => state.Team.teamID
    })
  },
  watch: {
    color: function () {
      this.canvas.freeDrawingBrush.color = this.getColor()
    },
    size: function () {
      this.canvas.freeDrawingBrush.width = this.size
    }
  },
  created () {
    this.conferenceID = Number(this.$route.query.conferenceID)
    if (this.conferenceID) {
      this.$store.commit('ENTER_CONFERENCE', this.conferenceID)
      Api.getObjects({
        model: 'Conference',
        condition: { id: this.conferenceID }
      })
        .then(response => {
          this.founderID = response.data.objects[0].founderID
          this.conferenceName = response.data.objects[0].conferenceName
          this.conferenceInformation = response.data.objects[0]
          this.isVisitor = (this.teamID !== this.conferenceInformation.teamID)
          if (this.isVisitor) {
            this.checkConferenceToken()
          }
        })
    } else {
      this.isValid = false
    }
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
    window.onload = e => {
      e = e || window.event
      if (e) {
        this.$io.emit('enterConference',
          this.userID,
          this.conferenceID)
      }
    }
    window.onbeforeunload = e => {
      e = e || window.event
      if (e) {
        this.$io.emit('exitConference',
          this.userID,
          this.conferenceID)
      }
    }
  },
  beforeDestroy () {
    this.$io.emit('exitConference',
      this.userID,
      this.conferenceID)
  },
  methods: {
    showPicker () {
      document.addEventListener('click', this.documentClick)
      this.displayPicker = true
    },
    hidePicker () {
      document.removeEventListener('click', this.documentClick)
      this.displayPicker = false
    },
    togglePicker () {
      this.displayPicker ? this.hidePicker() : this.showPicker()
    },
    documentClick (e) {
      const el = this.$refs.colorContainer
      const target = e.target
      if (el !== target && !el.contains(target)) {
        this.hidePicker()
      }
    },
    showLineHeight () {
      document.addEventListener('mousedown', this.documentMouseDown)
      this.displayLineHeight = true
    },
    hideLineHeight () {
      document.addEventListener('mouseup', this.documentMouseUp)
      this.displayLineHeight = false
    },
    toggleLineHeight () {
      this.hideLineHeight()
      this.showLineHeight()
    },
    documentMouseDown (e) {
      const el = this.$refs.lineHeight
      const target = e.target
      if (el !== target && !el.contains(target)) {
        this.displayLineHeight = false
      }
    },
    documentMouseUp () {
      document.removeEventListener('mousedown', this.documentMouseDown)
      document.removeEventListener('mouseup', this.documentMouseUp)
      this.displayLineHeight = false
    },
    checkConferenceToken () {
      const conferenceToken = this.$route.query.conferenceToken
      if (conferenceToken) {
        Api.checkConferenceToken({
          conferenceToken: conferenceToken
        })
          .then((response) => {
            if (response.data.message === 'VALID' && response.data.expired === false) {
              this.isValid = true
            } else {
              this.isValid = false
            }
          })
          .catch(error => console.log(error))
      } else {
        this.isValid = false
      }
    },
    shareConference () {
      Api.generateConferenceToken({
        conferenceID: this.conferenceID
      })
        .then((response) => {
          if (response.data.message === 'SUCCESS') {
            this.URL = process.env.VUE_APP_CONFERENCE_BASE + '?conferenceToken=' + response.data.conferenceToken +
                       '&' + 'conferenceID=' + this.conferenceID
            this.$copyText(this.URL).then(this.copySuccess, this.copyFail)
          }
        })
        .catch((error) => console.log(error))
    },
    copySuccess () {
      this.copyNotice = '会议室链接已复制到剪贴板'
      this.showCopyNotice()
    },
    copyFail () {
      this.copyNotice = '该浏览器不支持自动复制'
      this.showCopyNotice()
    },
    showCopyNotice () {
      setTimeout(() => {
        this.$refs.copySuccess.$emit('close')
      }, 1500)
    },
    updateMemberList () {
      this.$refs.memberList.getMembers()
    },
    exitConference () {
      this.$io.emit('exitConference',
        this.userID,
        this.conferenceID)
      if (this.isVisitor) {
        this.$router.push({ path: '/team/teammanage' })
      } else {
        this.$router.push({ path: '/team/teamofuser' })
      }
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
      return this.color
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
  background-color: #fff;
  position: fixed;
  top: 5px;
  left: 1%;
}

.left-center {
  position: fixed;
  left: 1%;
  top: 25%;
}

.left-bottom {
  position: fixed;
  bottom: 5px;
  left: 1%;
}

.right-top-center {
  position: fixed;
  top: 5px;
  right: 2%;
}

.right-bottom-center {
  position: fixed;
  right: 5px;
  bottom: 5px;
}

.conference-name {
  border-left: #a0a0a0 dashed 1px;
  border-right: #7f7f7f dashed 1px;
}

.conference-name-link {
  text-decoration: none;
  color: #111;
  font-size: 20px;
}

.conference-name-link:hover {
  text-decoration: none;
  color: #0a20dc;
  font-size: 20px;
}

.button-toolbar,
.extra-button-toolbar,
.user-list,
.setting-toolbar,
.logo-bar {
  border-radius: 5px;
  box-shadow: 1px 1px 5px #7f7f7f;
}

.dropdown-shape {
  min-width: 0;
}

.logo span {
  font-family: Logo, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 30px;
}

.color-picker {
  position: fixed;
  right: 5px;
  bottom: 55px;
}

.current-color {
  display: inline-block;
  width: 50px;
  height: 50px;
  border-bottom-right-radius: 30px;
  position: fixed;
  right: 5px;
  bottom: 5px;
}

.detail-display-container {
  width: 200px;
  height: 200px;
  border-radius: 5px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -100px;
  margin-left: -100px;
  background-color: #eee;
  filter: blur(19px);
}

.detail-line-height {
  border-radius: 50%;
  position: fixed;
  top: 50%;
  left: 50%;
  color: rgba(255, 255, 255, 0.7);
}

.invalid-token {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
}

.invalid-token img {
  width: 800px;
}
</style>

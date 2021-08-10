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
          v-b-popover.hover.top="'多人音视频'"
          v-b-modal.media-device-test>
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
    <div id="video-container">
      <div id="me" style="display: none;"></div>
      <div id="remote-container"></div>
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
    <!-- Modal -->
    <b-modal class="modal fade" id="media-device-test" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <template #modal-header="{ }">
        <h5 class="modal-title" id="modal-label">Media Device Test</h5>
      </template>
      <template>
        <div class="device-check-container">
          <h5 class="device-name">Microphone</h5>
          <p>Produce sounds to check if the mic works.</p>
          <div class="input-group mb-3">
            <b-dropdown id="mics-dropdown" style="width: 82px;" text="Mics" @click.native="(event)=>switchMicrophone(event.target.outerText)">
              <template v-for="(mic,index) in mics" >
                <b-dropdown-item v-bind:key="index">{{mic.label}}</b-dropdown-item>
              </template>
            </b-dropdown>
            <input type="text" class="mic-input form-control" aria-label="Text input with dropdown button" readonly>
          </div>
          <div class="progress">
            <div class="progress-bar bg-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <h5 class="device-name">Camera</h5>
          <p>Move in front of the camera to check if it works.</p>
          <div class="input-group mb-3">
            <b-dropdown id="cams-dropdown" style="width: 82px;" text="Cams" @click.native="(event)=>switchCamera(event.target.outerText)">
              <template v-for="(cam,index) in cams" >
                <b-dropdown-item v-bind:key="index">{{cam.label}}</b-dropdown-item>
              </template>

            </b-dropdown>
            <input type="text" class="cam-input form-control" aria-label="Text input with dropdown button" readonly>
          </div>
          <div id="pre-local-player" class="player"></div>
        </div>
      </template>
      <template #modal-footer="{}">
        <button type="button" class="btn btn-secondary" @click="joinChannel(false)">关闭摄像头与麦克风后进入</button>
        <button type="button" class="btn btn-primary" @click="joinChannel(true)" >进入会议室</button>
      </template>
    </b-modal>
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
import AgoraRTC from 'agora-rtc-sdk-ng'
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
      isVisitor: '',
      // for video
      videoClient: undefined,
      localTracks: {
        videoTrack: null,
        audioTrack: null
      },
      videoOptions: {
        appID: 'a72e28c547214bb7a8c03c136be2ff11',
        token: null
      },
      mics: [], // all microphones devices you can use
      cams: [], // all cameras devices you can use
      currentMic: undefined, // the microphone you are using
      currentCam: undefined, // the camera you are using
      volumeAnimation: undefined
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
    this.$io.on('initVideo', this.initVideo)
    this.$io.emit('enterVideo',
      this.userID,
      this.conferenceID)
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
    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
      if (bvEvent.componentId === 'media-device-test') {
        cancelAnimationFrame(this.volumeAnimation)
      }
    })
    this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
      if (bvEvent.componentId === 'media-device-test') {
        this.mediaDeviceTest()
      }
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
    },
    mediaDeviceTest: async function () {
      if (this.localTracks.audioTrack && this.localTracks.videoTrack) {
        this.localTracks.videoTrack.stop()
        this.localTracks.videoTrack.close()
        this.localTracks.audioTrack.stop()
        this.localTracks.audioTrack.close()
      }
      // get mics
      this.mics = await AgoraRTC.getMicrophones()
      this.currentMic = this.mics[0]
      if (this.currentMic) {
        this.localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
        this.volumeAnimation = requestAnimationFrame(this.setVolumeWave)
        document.getElementsByClassName('mic-input')[0].setAttribute('value', this.currentMic.label)
      } else {
        document.getElementsByClassName('mic-input')[0].setAttribute('value', 'Not found, please check')
      }
      // get cameras
      this.cams = await AgoraRTC.getCameras()
      this.currentCam = this.cams[0]
      console.log(this.currentCam)
      if (this.currentCam) {
        this.localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack()
        this.localTracks.videoTrack.play('pre-local-player')
        document.getElementsByClassName('cam-input')[0].setAttribute('value', this.currentCam.label)
      } else {
        document.getElementsByClassName('cam-input')[0].setAttribute('value', 'Not found, please check')
      }
    },
    joinChannel: async function (withCamera) {
      this.$bvModal.hide('media-device-test')
      if (this.localTracks.videoTrack) {
        this.localTracks.videoTrack.stop()
      }
      if (!this.videoClient._joinInfo) {
        await this.videoClient.join(this.videoOptions.appID, 'Conference' + this.conferenceID, this.videoOptions.token, this.userID)
      }
      if (withCamera) {
        if (this.localTracks.videoTrack && this.localTracks.audioTrack) {
          document.getElementById('me').style.display = 'block'
          this.localTracks.videoTrack.play('me')
          await this.videoClient.publish([this.localTracks.audioTrack, this.localTracks.videoTrack])
        }
      } else {
        document.getElementById('me').style.display = 'none'
        if (this.localTracks.videoTrack) {
          this.localTracks.videoTrack.close()
        }
        if (this.localTracks.audioTrack) {
          this.localTracks.audioTrack.stop()
          this.localTracks.audioTrack.close()
        }
        this.localTracks = {
          videoTrack: null,
          audioTrack: null
        }
      }
    },
    switchCamera: async function (label) {
      this.currentCam = this.cams.find(cam => cam.label === label)
      document.getElementsByClassName('cam-input')[0].setAttribute('value', this.currentCam.label)
      await this.localTracks.videoTrack.setDevice(this.currentCam.deviceId)
    },

    switchMicrophone: async function (label) {
      this.currentMic = this.mics.find(mic => mic.label === label)
      document.getElementsByClassName('mic-input')[0].setAttribute('value', this.currentMic.label)
      await this.localTracks.audioTrack.setDevice(this.currentMic.deviceId)
    },
    setVolumeWave: function () {
      this.volumeAnimation = requestAnimationFrame(this.setVolumeWave)
      const progressBar = document.getElementsByClassName('progress-bar')[0]
      progressBar.style.width = this.localTracks.audioTrack.getVolumeLevel() * 100 + '%'
      progressBar.setAttribute('aria-valuenow', this.localTracks.audioTrack.getVolumeLevel() * 100)
    },
    initVideo: async function (videoToken) {
      this.videoOptions.token = videoToken
      this.videoClient = AgoraRTC.createClient({
        mode: 'rtc',
        codec: 'vp8'
      })
      this.videoClient.on('user-published', async (user, mediaType) => {
        // 开始订阅远端用户。
        await this.videoClient.subscribe(user, mediaType)
        if (mediaType === 'video') {
          // 订阅完成后，从 `user` 中获取远端视频轨道对象。
          const remoteVideoTrack = user.videoTrack
          // 动态插入一个 DIV 节点作为播放远端视频轨道的容器。
          const playerContainer = document.createElement('div')
          // 给这个 DIV 节点指定一个 ID，这里指定的是远端用户的 UID。
          playerContainer.id = user.uid.toString()
          playerContainer.style.width = '200px'
          playerContainer.style.height = '200px'
          playerContainer.style.transform = 'rotateY(180deg)'
          playerContainer.style.border = '#3c465d 1px solid'
          playerContainer.style.marginLeft = '10px'
          document.getElementById('remote-container').append(playerContainer)
          remoteVideoTrack.play(playerContainer)
          // 也可以只传入该 DIV 节点的 ID。
          // remoteVideoTrack.play(playerContainer.id);
        }
        if (mediaType === 'audio') {
          const remoteAudioTrack = user.audioTrack
          remoteAudioTrack.play()
        }
      })
      this.videoClient.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'video') {
          const playerContainer = document.getElementById(user.uid.toString())
          playerContainer.remove()
        }
      })
      this.$bvModal.show('media-device-test')
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
}

#video-container {
  position: fixed;
  bottom: 5px;
  left: 200px;
  display: flex;
}

#me {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  display: block;
  border: #4a9ee9 2px solid;
}

#me video {
  position: relative !important;
  width: 200px;
}

#remote-container {
  display: flex;
}

#remote-container video {
  height: auto;
  position: relative !important;
}

#shape {
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

input {
  width: 100%;
  margin-bottom: 2px;
}

.player {
  width: 480px;
  height: 320px;
}

#pre-local-player {
  width: 240px;
  height: 180px;
}

.progress {
  margin-bottom: 10px;
}

.progress-bar {
  transition-duration: 0.3s;
}

@media (max-width: 640px) {
  .player {
    width: 320px;
    height: 240px;
  }
}
</style>

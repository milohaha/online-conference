<template>
<div>
  <div v-if="isValid">
    <div class="canvas-container">
      <canvas id="canvas" width="1536px" height="754px"></canvas>
      <div class='document-block-container'>
        <document-block v-for="docID in documentArray"
                        @mousedown="documentDrag"
                        @click="addCommentBlock"
                        @displayComment="displayComment"
                        :key="docID"
                        :identifier="docID"
                        :ref="'doc'+docID"
                        :init-params="initBlocksOfCanvas.get(docID)"
                        @remove="removeDocumentBlock"
                        @addComment="addComment"
                        @deleteCommentBlock="deleteCommentBlock"
                        @revokeComment="revokeComment">
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

      <div class="comment-block-container">
      <CommentBlock v-for="commentBlockID in blocks"
                    :key="commentBlockID"
                    :identifier="commentBlockID"
                    :ref="'commentBlock'+commentBlockID"
                    :init-params="initCommentBlocks.get(commentBlockID)"
                    @click="displayComment"
                    @addComment="addComment"
                    @deleteCommentBlock="deleteCommentBlock"
                    @revokeComment="revokeComment">
      </CommentBlock>
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
      <span class="file-selector-wrapper">
          <input type="file"
                 style="display: none;"
                 id="file-selector"
                 accept="application/pdf"
                 @change="loadFileHandler">
      </span>
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
        <b-button
          v-b-popover.hover.bottomleft="'共享视角'"
          variant="light"
          v-b-modal.share-view
          @click="isSharing = true"
        >
          <span class="fmtfont fmt-user"></span>
        </b-button>
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
        <b-button-group class="setting-toolbar d-flex align-items-center justify-content-around">
          <div class="d-flex align-items-center share-button">
            <b-button
              id="copyURL"
              @click="shareConference"
              pill
              variant="primary"
              class="px-3 mx-2">
              分享
            </b-button>
            <b-popover triggers="hover" target="copyURL" placement="bottom">
              点击分享复制会议室链接
            </b-popover>

          </div>
          <notice-side-bar
            @clickSideBar="clickSideBar">
          </notice-side-bar>
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
        <!--        鼠标-->
        <b-button
          class="fmtfont fmt-mouse"
          variant="light"
          v-b-popover.hover.right="'鼠标'"
          @click="switchToCursor">
        </b-button>
        <!--          拖拽-->
        <b-button
          class="fmtfont fmt-drag"
          variant="light"
          v-b-popover.hover.right="'拖拽'"
          @click="switchToDrag">
        </b-button>
        <!--        笔-->
        <b-button
          class="fmtfont fmt-pen"
          variant="light"
          @click="switchToPen"
          v-b-popover.hover.right="'画笔'">
        </b-button>
        <!--        图形-->
        <b-dropdown
          no-caret
          variant="light"
          dropright
          v-b-popover.hover.right="'图形'"
          menu-class="dropdown-shape">
          <template #button-content>
            <span class="fmtfont fmt-shape"></span>
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
        <!--        文本-->
        <b-button
          name="itext"
          @click="addShape"
          variant="light"
          class="fmtfont fmt-text"
          v-b-popover.hover.right="'文本'">
        </b-button>
        <!--        橡皮擦-->
        <b-button
          @click="switchToEraser"
          class="fmtfont fmt-eraser"
          variant="light"
          v-b-popover.hover.right="'橡皮擦'">
        </b-button>
        <!--          注释-->
        <b-button
          class="fmtfont fmt-comment"
          variant="light"
          @click="switchToComment"
          v-b-popover.hover.right="'注释'">
        </b-button>
        <!--        上传-->
        <b-button
          class="fmtfont fmt-upload"
          variant="light"
          @click="clickFileSelector"
          v-b-popover.hover.right="'上传文件'">
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
          v-b-popover.hover.top="'音视频'"
          @click="toggleMediaDeviceTest">
        </b-button>
        <!--        代码块-->
        <b-dropdown
          no-caret
          variant="light"
          droptop
          v-b-popover.hover.top="'协同编辑代码'"
          menu-class="dropdown-code">
          <template #button-content>
            <span class="fmtfont fmt-codeblock"></span>
          </template>
          <b-dropdown-item @click="addDocumentBlock('code','javascript')">JavaScript</b-dropdown-item>
          <b-dropdown-item @click="addDocumentBlock('code','x-python')">Python</b-dropdown-item>
          <b-dropdown-item @click="addDocumentBlock('code','x-csrc')">C</b-dropdown-item>
          <b-dropdown-item @click="addDocumentBlock('code','x-c++src')">C++</b-dropdown-item>
          <b-dropdown-item @click="addDocumentBlock('code','x-java')">Java</b-dropdown-item>
          <b-dropdown-item @click="addDocumentBlock('code','x-sh')">Shell</b-dropdown-item>
          <b-dropdown-item @click="addDocumentBlock('code','x-sql')">SQL</b-dropdown-item>

        </b-dropdown>

        <!--        文档-->
        <b-button
          class="fmtfont fmt-document"
          @click="addDocumentBlock('text')"
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
        <div class="detail-options-container mx-2" ref="lineHeight">
          <vs-slider
            v-if="!isMessageSideBarOpen"
            v-model="size"
            color="black"
            max="20"
            @change="toggleLineHeight"></vs-slider>
        </div>
      </div>
      <div class="right-bottom m-2">
        <div
          v-if="!isMessageSideBarOpen"
          class="color-container"
          ref="colorContainer">
          <color-panel
            class="color-picker"
            v-model="color"
            v-if="displayPicker"></color-panel>
          <span
            class="current-color"
            v-b-popover.hover.lefttop="'调色盘'"
            :style="'background-color: ' + color"
            @click="togglePicker"></span>
        </div>
      </div>
    </div>
    <div class="detail-display-container"
      v-if="displayLineHeight">
    </div>
    <div class="detail-line-height"
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
      width="500px"
      shadow="lg"
      backdrop
      z-index="99">
      <template #header>
        <div
          class="d-flex align-items-center justify-content-between"
          :style="{ 'width':500 + 'px' }">
          <div class="d-flex align-items-center justify-content-start">
            <div>成员列表</div>
            <div class="mx-3">
              <b-button
                variant="outline-info"
                size="md"
                @click="inviteNewMember"
              >
              邀请新成员
              </b-button>
            </div>
          </div>
          <span
            v-b-toggle.member-list
            class="fmtfont fmt-close close-button mx-2">
          </span>
        </div>
      </template>
      <member-list
        groupType="Conference"
        ref="memberList"
      ></member-list>
    </b-sidebar>
    <invite-new-member
      inviteType="invite-conference-member"
      :groupID="conferenceID"
      @inviteSuccess="inviteSuccess"
      @noOneToInvite="isInviting = false"
      v-if="isInviting === true"
    >
    </invite-new-member>
    <conference-information
      :conferenceInformation="conferenceInformation"
      :conferenceID="conferenceID"
      :isFounder="founderID === userID">
    </conference-information>
    <!-- Modal -->
    <b-modal
      class="modal fade"
      id="media-device-test"
      data-backdrop="static"
      tabindex="-1"
      role="dialog"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true">
      <template #modal-header="{ }">
        <h5 class="modal-title" id="modal-label">Media Device Test</h5>
      </template>
      <template>
        <div class="device-check-container">
          <h5 class="device-name">Microphone</h5>
          <p>Produce sounds to check if the mic works.</p>
          <div class="input-group mb-3">
            <b-dropdown
              id="mics-dropdown"
              style="width: 82px;"
              text="Mics"
              @click.native="(event) => switchMicrophone(event.target.outerText)">
              <template v-for="(mic,index) in mics" >
                <b-dropdown-item v-bind:key="index">{{ mic.label }}</b-dropdown-item>
              </template>
            </b-dropdown>
            <input
              type="text"
              class="mic-input form-control"
              aria-label="Text input with dropdown button"
              readonly>
          </div>
          <div class="progress">
            <div
              class="progress-bar bg-success"
              role="progressbar"
              aria-valuenow="0"
              aria-valuemin="0"
              aria-valuemax="100">
            </div>
          </div>
          <h5 class="device-name">Camera</h5>
          <p>Move in front of the camera to check if it works.</p>
          <div class="input-group mb-3">
            <b-dropdown
              id="cams-dropdown"
              style="width: 82px;"
              text="Cams"
              @click.native="(event) => switchCamera(event.target.outerText)">
              <template v-for="(cam,index) in cams" >
                <b-dropdown-item v-bind:key="index">{{ cam.label }}</b-dropdown-item>
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
    <share-view-list
      :conferenceID="conferenceID"
      :userID="userID"
      :founderID="founderID"
      v-if="isSharing"
      @shareView="shareMyView"
    ></share-view-list>
    <share-my-view-check @agree="agreeToShareMyView" @reject="rejectToShareMyView"></share-my-view-check>
  </div>
  <div v-else class="invalid-token">
    <p>链接已失效</p>
    <img src="../../assets/picture/error404.png" alt="链接失效">
  </div>
</div>
</template>
<script>
import Logo from '../../components/PublicComponents/Logos/Logo.vue'
import MemberList from '../../components/Team/ConferenceMemberList.vue'
import ConferenceInformation from '../../components/Team/ConferenceInformation'
import { mapState } from 'vuex'
import Api from '../../api'
import { fabric } from 'fabric'
import '../../components/Conference/eraser_brush.mixin'
import { v1 as uuid } from 'uuid'
import DocumentBlock from '../../components/Conference/DocumentBlock'
import AgoraRTC from 'agora-rtc-sdk-ng'
import InviteNewMember from '../../components/Team/InviteNewMember.vue'
import AgoraRTC from 'agora-rtc-sdk-ng'
import NoticeSideBar from '../../components/PublicComponents/Notice/NoticeSideBar'
import CommentBlock from '../../components/Conference/CommentBlock'
import UploadFile from '../../components/Conference/UploadFile'
import ShareViewList from '../../components/Conference/ShareViewList'
import ShareMyViewCheck from '../../components/Conference/ShareMyViewCheck'
export default {
  data: function () {
    return {
      size: 3,
      color: '#111111',
      isMessageSideBarOpen: false,
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
      isInviting: false,
      isSharing: false,
      paramsForSharingView: '',
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
      volumeAnimation: undefined,
      dragging: false,
      dragMode: false,
      zoom: 1,
      relativeX: 0,
      relativeY: 0,
      fileArray: [],
      initFile: undefined,
      // for comment
      blockComments: [],
      freeComments: [],
      currentComments: [],
      currentCommentType: 'block',
      currentBlockID: 0,
      blocks: [],
      initCommentBlocks: undefined,
      commentMode: false,
      documentBlockOfComment: undefined
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
    AgoraRTC.setLogLevel(4)
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
    this.$io.on('leave', () => {
      alert('您已被移出会议室')
      if (this.isVisitor) {
        this.$router.push({ path: '/team/teampage' })
      } else {
        this.$router.push({ path: '/team/teamofuser' })
      }
    })
    this.$io.on('enter', () => {
      this.updateMemberList()
    })
    this.$io.on('exit', () => {
      this.updateMemberList()
    })
    this.$io.on('initCanvas', (itemsOfCanvas, blocksOfCanvas, filesOfCanvas, blocks, blockComments, freeComments) => {
      for (const item of itemsOfCanvas) {
        this.updateBoard(this.canvas, item, 0)
      }
      for (const block of blocksOfCanvas) {
        this.documentArray.push(block.itemID)
        // 不直接更新位置是因为此时document-block未渲染完毕,无法根据id拿到它
        this.initBlocksOfCanvas.set(block.itemID,
          { left: block.itemLeft, top: block.itemTop, type: block.type, language: block.language, zoom: this.zoom })
      }
      for (const file of filesOfCanvas) {
        this.fileArray.push(file.fileID)
        this.initFile.set(file.fileID, { left: file.fileLeft, top: file.fileTop, fileContent: file.fileContent, zoom: this.zoom })
      }
      for (const block of blocks) {
        if (block.stickBlockID === null || block.stickBlockID === undefined) {
          this.blocks.push(block.commentBlockID)
          this.initCommentBlocks.set(block.commentBlockID,
            {
              left: block.left,
              top: block.top,
              commentBlockID: block.commentBlockID,
              conferenceID: block.conferenceID,
              stickBlockID: block.stickBlockID
            })
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
      this.$bvModal.show('share-view-check')
      this.paramsForSharingView = params
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

    this.$io.on('initVideo', this.initVideo)
    this.$io.emit('enterVideo',
      this.userID,
      this.conferenceID)
    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
      if (bvEvent.componentId === 'media-device-test') {
        cancelAnimationFrame(this.volumeAnimation)
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
      cancelAnimationFrame(this.volumeAnimation)
    }

    this.canvas.on({
      'mouse:down': (event) => {
        this.addCommentBlock(event)
      }
    })
    this.$io.on('newCommentBlock', (block) => {
      if (block.stickBlockID === null || block.stickBlockID === undefined) {
        this.blocks.push(block.commentBlockID)
        block.left = (block.left + this.relativeX) * this.zoom
        block.top = (block.top + this.relativeY) * this.zoom
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
      if (type === 'free') {
        this.blocks.splice(this.blocks.findIndex(block => block === commentBlockID), 1)
      } else {
        const ref = 'doc' + documentBlockID
        this.$refs[ref][0].setComment(false)
      }
    })
    this.toggleMediaDeviceTest()
  },
  beforeDestroy () {
    cancelAnimationFrame(this.volumeAnimation)
    if (this.localTracks.videoTrack && this.localTracks.audioTrack) {
      this.localTracks.videoTrack.stop()
      this.localTracks.videoTrack.close()
      this.localTracks.audioTrack.stop()
      this.localTracks.audioTrack.close()
    }
    this.videoClient.leave()
    this.$io.emit('exitConference',
      this.userID,
      this.conferenceID)
    this.$io.off('leave')
    this.$io.off('enter')
    this.$io.off('exit')
  },
  methods: {
    inviteSuccess () {
      this.isInviting = false
      this.$refs.memberList.getMembers()
    },
    inviteNewMember () {
      this.isInviting = true
      setTimeout(() => {
        this.$bvModal.show('invite-conference-member')
      }, 1)
    },
    clickSideBar (isOpen) {
      this.isMessageSideBarOpen = isOpen
    },
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
    rejectToShareMyView () {
      this.paramsForSharingView = ''
    },
    agreeToShareMyView () {
      const params = this.paramsForSharingView
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
    },
    addCommentBlock: function (event, stickBlockID) {
      if (!this.commentMode) {
        return
      }
      this.commentMode = false
      const ID = uuid()
      if (stickBlockID === null || stickBlockID === undefined) {
        this.$io.emit('addCommentBlock', { conferenceID: this.conferenceID, commentBlockID: ID, left: -this.relativeX + event.pointer.x / this.zoom, top: -this.relativeY + event.pointer.y / this.zoom })
      } else {
        const ref = 'doc' + stickBlockID
        if (!this.$refs[ref][0].commentID) {
          this.$io.emit('addCommentBlock', { conferenceID: this.conferenceID, commentBlockID: ID, stickBlockID: stickBlockID, left: -this.relativeX + event.x / this.zoom, top: -this.relativeY + event.y / this.zoom })
        }
      }
    },
    deleteCommentBlock: function (event, type, currentBlockID, documentBlockOfComment) {
      if (type === 'block') {
        const ref = 'doc' + documentBlockOfComment
        this.$refs[ref][0].setComment(false)
      }
      this.$io.emit('deleteCommentBlock', currentBlockID, this.conferenceID)
    },
    revokeComment: function (commentID, type) {
      let comment
      if (type === 'block') {
        comment = this.blockComments.find(data => data.commentItemID === commentID)
      } else {
        comment = this.freeComments.find(data => data.commentItemID === commentID)
      }
      this.$io.emit('revokeComment', type, comment, this.conferenceID)
    },
    addComment: function (content, commentBlockID) {
      const ID = uuid()
      this.$io.emit('addComment', {
        commentBlockID: commentBlockID,
        userID: localStorage.getItem('userID'),
        content: content,
        commentItemID: ID
      }, this.conferenceID)
    },
    displayComment: function (e, type, commentID, documentID) {
      console.log('display:', e, type, commentID, documentID)
      let commentBlock
      if (type === 'block') {
        this.documentBlockOfComment = documentID
        const ref = 'doc' + documentID
        commentBlock = this.$refs[ref][0]
      } else {
        const ref = 'commentBlock' + commentID
        commentBlock = this.$refs[ref][0]
      }
      this.refresh(type, commentID)
      this.currentBlockID = commentID
      this.currentCommentType = type
      commentBlock.setCommentContent(this.currentComments)
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
        this.$io.emit('dragBlockStop', { left: parseFloat(docDiv.style.left) / this.zoom - this.relativeX, top: parseFloat(docDiv.style.top) / this.zoom - this.relativeY, docID: docDiv.id.substr(12, docDiv.id.length - 12) })
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
        this.$io.emit('dragFileStop', { left: parseFloat(fileDiv.style.left) / this.zoom - this.relativeX, top: parseFloat(fileDiv.style.top) / this.zoom - this.relativeY, fileID: fileDiv.id.substr(11, fileDiv.id.length - 11) })
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
      // this.$refs.memberList.getMembers()
      this.$refs.memberList.getMembers()
    },
    exitConference () {
      this.$io.emit('exitConference',
        this.userID,
        this.conferenceID)
      if (this.isVisitor) {
        this.$router.push({ path: '/team/teampage' })
      } else {
        this.$router.push({ path: '/team/teamofuser' })
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
      this.canvas.isDrawingMode = false
    },
    switchToDrag: function () {
      this.canvas.isDrawingMode = false
      this.dragMode = true
      this.commentMode = false
    },
    shareMyView: function (toWhomID) {
      this.isSharing = false
      this.$io.emit('shareMyView', toWhomID, {
        viewportTransform: this.canvas.viewportTransform,
        relativeX: this.relativeX,
        relativeY: this.relativeY
      })
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
      fabricItem.set({ left: -this.canvas.viewportTransform[4] + window.innerWidth / 2, top: -this.canvas.viewportTransform[5] + window.innerHeight / 2 })
      this.canvas.add(fabricItem)
      this.canvas.renderAll()
    },
    addDocumentBlock: function (type, language) {
      const docID = uuid()
      this.documentArray.push(docID)
      this.initBlocksOfCanvas.set(docID, { left: window.innerWidth / 2, top: window.innerHeight / 2, type: type, language: language, zoom: this.zoom })
      // 通知会议室里其他socket
      this.$io.emit('newDocumentBlock', { conferenceID: this.conferenceID, docID: docID, type: type, left: window.innerWidth / 2 / this.zoom - this.relativeX, top: window.innerHeight / 2 / this.zoom - this.relativeY, language: language })
    },
    removeDocumentBlock: function (docID) {
      this.documentArray.splice(this.documentArray.findIndex(document => document === docID), 1)
      this.$io.emit('deleteDocumentBlock', { conferenceID: this.conferenceID, docID: docID })
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
          that.initFile.set(fileID, { left: window.innerWidth / 2, top: window.innerHeight / 2, fileContent: fileContent, zoom: this.zoom })
          that.$io.emit('newPdfFile', { conferenceID: that.conferenceID, fileContent: fileContent, fileID: fileID, left: window.innerWidth / 2 / this.zoom - this.relativeX, top: window.innerHeight / 2 / this.zoom - this.relativeY })
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
    },
    showLineHeight () {
      document.addEventListener('mousedown', this.documentMouseDown)
      this.displayLineHeight = true
    },
    hideLineHeight () {
      document.addEventListener('mouseup', this.documentMouseUp)
      this.displayLineHeight = false
    },
    toggleMediaDeviceTest () {
      this.$bvModal.show('media-device-test')
      this.mediaDeviceTest()
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
      const micLabel = document.getElementsByClassName('mic-input')[0]
      if (this.currentMic) {
        this.localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
        this.volumeAnimation = requestAnimationFrame(this.setVolumeWave)
        if (micLabel) { micLabel.setAttribute('value', this.currentMic.label) }
      } else {
        if (micLabel) { micLabel.setAttribute('value', 'Not found, please check') }
      }
      // get cameras
      this.cams = await AgoraRTC.getCameras()
      this.currentCam = this.cams[0]
      const camLabel = document.getElementsByClassName('cam-input')[0]
      if (this.currentCam) {
        this.localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack()
        this.localTracks.videoTrack.play('pre-local-player')
        if (camLabel) { camLabel.setAttribute('value', this.currentCam.label) }
      } else {
        if (camLabel) { camLabel.setAttribute('value', 'Not found, please check') }
      }
    },
    joinChannel: async function (withCamera) {
      if (this.localTracks.videoTrack) {
        this.localTracks.videoTrack.stop()
      }
      this.$bvModal.hide('media-device-test')
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
    MemberList,
    InviteNewMember,
    ConferenceInformation,
    DocumentBlock,
    NoticeSideBar,
    CommentBlock,
    UploadFile,
    ShareViewList,
    ShareMyViewCheck
  }
}
</script>
<style scoped>
.canvas-container {
  margin: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.left-top {
  z-index: 100;
  background-color: #fff;
  position: fixed;
  top: 5px;
  left: 1%;
}
.left-center {
  z-index: 100;
  position: fixed;
  left: 1%;
  top: 23%;
}
.left-bottom {
  z-index: 100;
  position: fixed;
  bottom: 5px;
  left: 1%;
}
.right-top-center {
  z-index: 100;
  position: fixed;
  top: 5px;
  right: 2%;
}
.right-bottom-center {
  z-index: 100;
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
.share-button {
  margin-right: 20px;
  margin-left: 10px;
}
.dropdown-shape {
  min-width: 0;
}
>>> .dropdown-code {
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
/* 视频 */
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

#notice-sidebar{
  z-index: 101;
}
@media (max-width: 640px) {
  .player {
    width: 320px;
    height: 240px;
  }
}

</style>

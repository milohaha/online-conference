<template>
  <div class="comment">
    <span
      :id="'commentBlock'+identifier"
      class="fmtfont fmt-comment comment-container"
      @click="displayComment">
    </span>
    <b-popover
      custom-class="popover-container"
      :target="'commentBlock'+identifier"
      triggers="click"
      :show.sync="popoverShow"
      placement="auto"
      container="comment"
      @show="onShow"
      z-index="0"
    >
      <template #title>
        <div class="d-flex align-items-center justify-content-between">
          <div>评论一下</div>
          <span class="fmtfont fmt-close close-btn" @click="onClose"></span>
        </div>
      </template>
      <div
        class="card-container">
        <b-card v-for="(comment,index) in comments" :key="index" class="my-2 mx-2 single-card">
          <template #header>
            <div class="d-flex align-items-center justify-content-around">
              <div>用户ID: {{ comment.userID }}</div>
              <small>{{ timeFormat(comment.createdAt) }}</small>
              <span class="fmtfont fmt-close card-close-btn" @click="deleteCard(comment.commentItemID)"></span>
            </div>
          </template>
          <div class="card-text">
            <div>{{ comment.content }}</div>
          </div>
        </b-card>
      </div>

      <div>
        <b-form-textarea
          id="textarea"
          v-model="text"
          placeholder="想说点什么..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>

        <div class="my-2">
          <b-button @click="onOk" size="sm" variant="primary">确定</b-button>
          <b-button @click="onClose" size="sm" variant="warning" class="mx-3">取消</b-button>
          <b-button @click="onDelete" size="sm" variant="danger">删除</b-button>
        </div>

      </div>
    </b-popover>
  </div>
</template>

<script>
import TimeFormat from '../../methods/publicMethods'
export default {
  name: 'CommentBlock',
  data: function () {
    return {
      text: '',
      inputState: null,
      popoverShow: false,
      comments: []
    }
  },
  props: {
    identifier: String,
    initParams: Object
  },
  watch: {
    text (val) {
      if (val) {
        this.inputState = true
      }
    }
  },
  methods: {
    timeFormat (time) {
      return TimeFormat.methods.getTime(time)
    },
    setCommentContent (comments) {
      this.comments = comments
    },
    displayComment: function (e, type = 'free') {
      this.$emit('click', e, type, this.identifier)
    },
    onClose () {
      this.popoverShow = false
    },
    onOk () {
      if (!this.text) {
        this.inputState = false
      }
      if (this.inputState) {
        this.onClose()
        this.$emit('addComment', this.text, this.identifier)
      }
    },
    onDelete () {
      this.$emit('deleteCommentBlock', {}, 'free', this.identifier)
    },
    onShow () {
      this.text = ''
      this.inputState = null
    },
    closeCard (commentID) {
      this.$emit('revokeComment', commentID, 'free')
    },
    deleteCard (commentID) {
      this.comments.splice(this.comments.findIndex((comment) => comment.commentItemID === commentID), 1)
      this.closeCard(commentID)
    }
  },
  mounted () {
    const commentBlock = document.getElementById(`commentBlock${this.identifier}`)
    if (this.initParams !== undefined) {
      const { left, top } = this.initParams
      commentBlock.style.left = left + 'px'
      commentBlock.style.top = top + 'px'
    }
  }
}
</script>

<style scoped>
.comment {
  width: 30px;
  height: 30px;
}
.comment-container {
  font-size: 14px;
  position: absolute;
}
.popover-container {
  max-width: 320px;
}
.card-container {
  max-height: 220px;
  overflow-y: scroll;
}
.single-card {
  width: 250px;
}
.close-btn {
  display: inline-block;
  font-size: 20px;
}
.card-close-btn {
  display: inline-block;
  font-size: 10px;
  position: absolute;
  top: 3px;
  right: 3px;
}
.card-text {
  max-width: 20rem;
}
</style>

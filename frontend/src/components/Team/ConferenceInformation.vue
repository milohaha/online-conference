<template>
  <div>
    <b-modal
      id="bv-modal-conference-information"
      backdrop
      centered
      hide-footer
      hide-header
      no-stacking>
      <div class="d-flex">
        <div class="picture">
          <b-img thumbnail src="https://picsum.photos/250/250/?image=54" alt="Image 1"></b-img>
        </div>
        <div class="justify-content-start mx-3 my-1">
          <p>会议室名称：{{ conferenceInformation.conferenceName }}</p>
          <p>创建者：{{ conferenceInformation.founderID }}</p>
          <p>创建时间：<br>{{ timeFormat(conferenceInformation.createdAt) }}</p>
        </div>
      </div>
      <div class="d-flex justify-content-end align-items-center">
        <b-button
          variant="outline-danger"
          v-b-modal.bv-modal-dismiss-group
          v-show="isFounder">
          解散会议室
        </b-button>
        <b-button
          variant="outline-danger"
          v-b-modal.bv-modal-leave-group
          v-show="!isFounder">
          离开会议室
        </b-button>
      </div>
    </b-modal>
    <dismiss-group
      :type="$constant.IS_CONFERENCE"
      :groupID="conferenceID">
    </dismiss-group>
    <leave-group
      :type="$constant.IS_CONFERENCE"
      :groupID="conferenceID">
    </leave-group>
  </div>
</template>
<script>
import DismissGroup from '../../components/Team/DismissGroup'
import LeaveGroup from '../../components/Team/LeaveGroup'
import TimeFormat from '../../methods/publicMethods'
export default {
  props: {
    conferenceInformation: Object,
    conferenceID: Number,
    isFounder: Boolean
  },
  methods: {
    timeFormat (time) {
      return TimeFormat.methods.getTime(time)
    }
  },
  components: {
    DismissGroup,
    LeaveGroup
  }
}
</script>

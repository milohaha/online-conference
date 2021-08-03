<template>
  <div>
    <b-modal id="create-new-conference"
      title="新建会议室"
      button-size="sm"
      no-stacking
    >
      <template #modal-footer>
        <b-button v-b-modal.create-success @click="checkInput">确定</b-button>
        <b-button @click="$bvModal.hide('create-new-conference')">取消</b-button>
      </template>
      <div class="create-new-conference-content">
        <b-form-input
          class="get-conference-name"
          v-model="conferenceName"
          placeholder="输入会议室名称"
          :state='nameState'
          aria-describedby="wrong-feedback"
        >
        </b-form-input>
        <b-form-invalid-feedback id='wrong-feedback'>
          请输入名称
        </b-form-invalid-feedback>
        <img src="../../assets/picture/conference.png" alt="conference">
      </div>
    </b-modal>
    <b-modal id="create-success" ok-only>
      <p>创建成功</p>
      <template #modal-ok>确定</template>
    </b-modal>
    <b-modal id="exist">
      <p>该会议室已存在</p>
      <template #modal-ok>确定</template>
    </b-modal>
    <b-modal id="invite-members">
      <template #modal-title>
        请选择与会成员
      </template>
      <b-list-group>
        <member-to-invite
          v-for="teamMember in teamMembers"
          :key="teamMember.id"
          :memberToInvite="teamMembers"
          @selectMember="selectMember"
        >
        </member-to-invite>
      </b-list-group>
    </b-modal>
  </div>
</template>
<script>
import MemberToInvite from '../Team/MemberToInvite.vue'
import { mapActions, mapState } from 'vuex'
export default {
  data: function () {
    return {
      conferenceName: '',
      teamMembers: [],
      membersSelected: []
    }
  },
  computed: {
    nameState () {
      return this.conferenceName.length > 0
    },
    ...mapActions({
      getMembers: 'getMembers'
    }),
    ...mapState({
      userID: (state) => state.Login.userID,
      teamID: (state) => state.Team.teamID
    })
  },
  methods: {
    checkInput () {
      if (!this.nameState) {
        this.$root.$once('bv::modal::hide', (bvEvent) => {
          bvEvent.preventDefault()
        })
        this.$root.$once('bv::modal::show', (bvEvent) => {
          bvEvent.preventDefault()
        })
      }
      this.conferenceName = ''
    },
    getMemberToInvite () {
      this.$store.dispatch('getMembers', {
        groupID: this.teamID,
        groupType: 'Team',
        inGroup: true
      })
        .then(response => {
          this.membersToInvite = response.data.members
          this.membersToInvite.splice(this.membersToInvite.findIndex(member => member.id === this.userID), 1)
        })
    },
    selectMember (memberID) {
      if (this.membersSelected.findIndex((memberSelected) => memberSelected === memberID) !== -1) {
        this.membersSelected.splice(this.membersSelected.findIndex((memberSelected) => {
          return memberSelected === memberID
        }), 1)
      } else {
        this.membersSelected.push(memberID)
      }
    }
  },
  components: {
    MemberToInvite
  }
}
</script>
<style scoped>
.input-button {
  width: inherit;
}
.get-conference-name {
  margin-top: 20px;
}

img {
  width: 350px;
  align-self: center;
}

#create-success {
  text-align: center;
}
.create-new-conference-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>

import InviteNewMember from '../components/Team/InviteNewMember.vue'
import socketio from 'socket.io-client'
import BootstrapVue from 'bootstrap-vue'
import { expect, describe, test } from '@jest/globals'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '../store/index'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)
localVue.prototype.$io = socketio.connect(process.env.VUE_APP_WEB_BASE, { transports: ['websocket'] })

describe('测试邀请团队成员', () => {
  let wrapper
  test('测试计算属性', () => {
    wrapper = shallowMount(InviteNewMember, {
      localVue,
      store,
      propsData: {
        inviteType: 'invite-team-member'
      }
    })
    expect(wrapper.vm.inviteInformation.inviteContent).toBe('邀请成员加入团队')
    expect(wrapper.vm.inviteInformation.confirmNoticeID).toBe('invite-team-member-check')
    expect(wrapper.vm.inviteInformation.inviteResultNoticeID).toBe('invite-team-success')
  })
  test('测试计算属性', () => {
    wrapper = shallowMount(InviteNewMember, {
      localVue,
      store,
      propsData: {
        inviteType: 'invite-conference-member'
      }
    })
    expect(wrapper.vm.inviteInformation.inviteContent).toBe('请选择与会成员')
    expect(wrapper.vm.inviteInformation.confirmNoticeID).toBe('invite-conference-member-check')
    expect(wrapper.vm.inviteInformation.inviteResultNoticeID).toBe('invite-conference-success')
  })
  test('取消邀请后清空选中成员', () => {
    wrapper.vm.membersSelected = [1, 2]
    wrapper.vm.cancelInviting()
    expect(wrapper.vm.membersSelected.length).toBe(0)
  })
})

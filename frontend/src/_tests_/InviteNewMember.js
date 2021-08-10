import InviteNewMember from '../components/Team/InviteNewMember.vue'
import socketio from 'socket.io-client'
import BootstrapVue from 'bootstrap-vue'
import { expect, describe, test, beforeEach, jest } from '@jest/globals'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '../store/index'
import Api from '../api'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)
localVue.prototype.$io = socketio.connect(process.env.VUE_APP_WEB_BASE, { transports: ['websocket'] })
const response = new Promise(resolve => {
  resolve({ data: { members: [{ id: 1 }, { id: 2 }] } })
},
reject => { reject('error') })
let wrapper
let vm

describe('测试邀请团队成员', () => {
  beforeEach(() => {
    wrapper = shallowMount(InviteNewMember, {
      localVue,
      store,
      propsData: {
        inviteType: 'invite-team-member'
      }
    })
    vm = wrapper.vm
    vm.$bvModal.hide = jest.fn()
    vm.$bvModal.show = jest.fn()
  })
  test('测试计算属性', () => {
    expect(wrapper.vm.inviteInformation.inviteContent).toBe('邀请成员加入团队')
    expect(wrapper.vm.inviteInformation.confirmNoticeID).toBe('invite-team-member-check')
    expect(wrapper.vm.inviteInformation.inviteResultNoticeID).toBe('invite-team-success')
  })
  test('取消邀请后清空选中成员', () => {
    vm.membersSelected = [1, 2]
    vm.cancelInviting()
    expect(vm.membersSelected.length).toBe(0)
  })
  test('弹出邀请确认', () => {
    vm.inviteCheck()
    expect(vm.$bvModal.show).toBeCalledTimes(1)
  })
  test('取消邀请确认', () => {
    vm.cancelInvitingCheck()
    expect(vm.$bvModal.hide).toBeCalledTimes(1)
  })
  test('邀请成功', () => {
    vm.inviteMemberSuccess()
    expect(vm.$bvModal.hide).toBeCalledTimes(3)
    expect(vm.membersSelected.length).toBe(0)
  })
  test('取消选择成员', () => {
    vm.membersSelected = [1, 2, 3]
    vm.selectMember(1)
    expect(vm.membersSelected.length).toBe(2)
  })
  test('选择成员', () => {
    vm.membersSelected = [1]
    vm.selectMember(2)
    expect(vm.membersSelected.length).toBe(2)
  })
  test('调用邀请团队成员函数', () => {
    vm.inviteTeamMember = jest.fn()
    vm.inviteMember()
    expect(vm.inviteTeamMember).toBeCalledTimes(1)
    expect(vm.$bvModal.show).toBeCalledTimes(1)
  })
  test('邀请团队成员', async () => {
    vm.$io.emit = jest.fn()
    await vm.inviteTeamMember()
    expect(vm.$io.emit).toBeCalledTimes(1)
  })
  test('获取可邀请的成员', async () => {
    Api.getMembers = jest.fn().mockReturnValue(response)
    await vm.getMemberToInvite()
    expect(vm.membersToInvite.length).toBe(2)
  })
})
describe('测试邀请会议室成员', () => {
  beforeEach(() => {
    wrapper = shallowMount(InviteNewMember, {
      localVue,
      store,
      propsData: {
        inviteType: 'invite-conference-member'
      }
    })
    vm = wrapper.vm
    jest.createMockFromModule('../api')
  })
  test('测试计算属性', () => {
    expect(vm.inviteInformation.inviteContent).toBe('邀请成员加入会议室')
    expect(vm.inviteInformation.confirmNoticeID).toBe('invite-conference-member-check')
    expect(vm.inviteInformation.inviteResultNoticeID).toBe('invite-conference-success')
  })
  test('调用邀请会议室成员函数', () => {
    vm.$bvModal.show = jest.fn()
    vm.inviteConferenceMember = jest.fn()
    vm.inviteMember()
    expect(vm.inviteConferenceMember).toBeCalledTimes(1)
    expect(vm.$bvModal.show).toBeCalledTimes(1)
  })
  test('邀请会议室成员', async () => {
    Api.inviteConferenceMember = jest.fn()
    await vm.inviteConferenceMember()
    expect(Api.inviteConferenceMember).toBeCalledTimes(1)
  })
})

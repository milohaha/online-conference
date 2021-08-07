import CreateNewGroup from '../components/Team/CreateNewGroup.vue'
import BootstrapVue from 'bootstrap-vue'
import { expect, test, describe, beforeEach, jest } from '@jest/globals'
import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '../store/index'
import Api from '../api'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)
let wrapper
const created = new Promise(resolve => { resolve({ data: { message: 'CREATED' } }) }, reject => { reject('error') })
const exists = new Promise(resolve => { resolve({ data: { message: 'EXISTS' } }) }, reject => { reject('error') })
const error = new Promise(resolve => { resolve({ data: { message: 'ERROR' } }) }, reject => { reject('error') })
describe('测试创建团队时计算属性', () => {
  beforeEach(() => {
    wrapper = mount(CreateNewGroup, {
      localVue,
      store,
      propsData: {
        groupType: 'Team'
      }
    })
  })
  test('测试标题', () => {
    expect(wrapper.vm.groupType).toBe('Team')
    expect(wrapper.vm.title).toBe('创建团队')
  })
  test('测试团队信息', () => {
    wrapper.vm.inputName = 'a'
    expect(wrapper.vm.groupInfo.groupName).toBe('a')
    expect(wrapper.vm.groupInfo.teamID).toBeUndefined()
    expect(wrapper.vm.nameState).toBeTruthy()
  })
  test('测试邀请类型', () => {
    expect(wrapper.vm.inviteType).toBe('invite-team-member')
  })
})
describe('测试创建会议室时计算属性', () => {
  beforeEach(() => {
    wrapper = mount(CreateNewGroup, {
      localVue,
      store,
      propsData: {
        groupType: 'Conference'
      }
    })
  })
  test('测试标题', () => {
    expect(wrapper.vm.title).toBe('新建会议室')
  })
  test('测试团队信息', () => {
    wrapper.vm.inputName = 'a'
    expect(wrapper.vm.groupInfo.groupName).toBe('a')
    expect(wrapper.vm.nameState).toBeTruthy()
  })
  test('测试邀请类型', () => {
    expect(wrapper.vm.inviteType).toBe('invite-conference-member')
  })
})
test('测试输入是否合法', () => {
  wrapper.vm.inputName = ''
  expect(wrapper.vm.nameState).toBeFalsy()
})
describe('测试显示创建结果信息', () => {
  beforeEach(() => {
    wrapper.vm.inputName = 'abc'
  })
  test('创建成功', async () => {
    Api.createGroup = jest.fn().mockReturnValue(created)
    await wrapper.vm.checkInput()
    expect(wrapper.vm.notice).toBe('创建成功')
  })
  test('名称存在', async () => {
    Api.createGroup = jest.fn().mockReturnValue(exists)
    await wrapper.vm.checkInput()
    expect(wrapper.vm.notice).toBe('创建失败，该名称已存在')
  })
  test('失败', async () => {
    Api.createGroup = jest.fn().mockReturnValue(error)
    await wrapper.vm.checkInput()
    expect(wrapper.vm.notice).toBe('创建失败，请稍后再尝试')
  })
})
describe('测试弹窗', () => {
  test('创建成功-显示邀请成员', () => {
    const mockhide = jest.fn()
    const mockshow = jest.fn()
    wrapper.vm.createResult = 'CREATED'
    wrapper.vm.$bvModal.hide = mockhide
    wrapper.vm.$bvModal.show = mockshow
    wrapper.vm.showInvitingMember()
    expect(mockhide).toBeCalledTimes(1)
    expect(mockshow).toBeCalledTimes(1)
  })
})

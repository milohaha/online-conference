import CreateNewGroup from '../components/Team/CreateNewGroup.vue'
import BootstrapVue from 'bootstrap-vue'
import { expect, test, describe, beforeEach } from '@jest/globals'
import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '../store/index'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)
let wrapper
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

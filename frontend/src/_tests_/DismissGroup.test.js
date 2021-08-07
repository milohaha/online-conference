import DismissGroup from '../components/Team/DismissGroup.vue'
import BootstrapVue from 'bootstrap-vue'
import { expect, test, describe, beforeEach, jest } from '@jest/globals'
import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '../store/index'
import socketio from 'socket.io-client'
import router from '../router'
import Constants from '../constants'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)
localVue.prototype.$constant = Constants
localVue.prototype.$io = socketio.connect(process.env.VUE_APP_WEB_BASE, { transports: ['websocket'] })
let wrapper
let vm
describe('测试解散团队', () => {
  beforeEach(() => {
    wrapper = mount(DismissGroup, {
      localVue,
      store,
      router,
      propsData: {
        type: 'Team'
      }
    })
    vm = wrapper.vm
  })
  test('测试类型名称', () => {
    expect(vm.typeName).toBe('团队')
  })
  test('函数调用正确', () => {
    vm.dismissTeam = jest.fn()
    vm.dismissGroup()
    expect(vm.dismissTeam).toBeCalledTimes(1)
  })
  test('解散成功', () => {
    vm.$bvModal.hide = jest.fn()
    vm.$router.push = jest.fn()
    vm.dismissGroupSuccess()
    expect(vm.$bvModal.hide).toBeCalledTimes(1)
    expect(vm.$router.push).toBeCalledTimes(1)
  })
  test('解散团队', () => {
    vm.$io.emit = jest.fn()
    vm.dismissTeam()
    expect(vm.$io.emit).toBeCalledTimes(1)
  })
})
describe('测试解散会议室', () => {
  beforeEach(() => {
    wrapper = mount(DismissGroup, {
      localVue,
      store,
      router,
      propsData: {
        type: 'Conference'
      }
    })
    vm = wrapper.vm
  })
  test('测试类型名称', () => {
    expect(vm.typeName).toBe('会议室')
  })
  test('函数调用正确', () => {
    vm.dismissConference = jest.fn()
    vm.dismissGroup()
    expect(vm.dismissConference).toBeCalledTimes(1)
  })
  test('解散会议室', () => {
    vm.$io.emit = jest.fn()
    vm.dismissConference()
    expect(vm.$io.emit).toBeCalledTimes(1)
  })
})

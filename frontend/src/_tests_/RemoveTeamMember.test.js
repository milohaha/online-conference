import RemoveTeamMember from '../components/Team/RemoveTeamMember.vue'
import BootstrapVue from 'bootstrap-vue'
import { expect, test, describe, beforeEach, jest } from '@jest/globals'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '../store/index'
import socketio from 'socket.io-client'
import Constants from '../constants'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)
localVue.prototype.$constant = Constants
localVue.prototype.$io = socketio.connect(process.env.VUE_APP_WEB_BASE, { transports: ['websocket'] })
let wrapper
let vm
let mockhide
let mockshow
describe('测试移除团队成员', () => {
  beforeEach(() => {
    wrapper = shallowMount(RemoveTeamMember, {
      localVue,
      store,
      propsData: {
        userID: 1,
        modalID: 'a'
      }
    })
    vm = wrapper.vm
    mockhide = jest.fn()
    mockshow = jest.fn()
    vm.$bvModal.hide = mockhide
    vm.$bvModal.show = mockshow
  })
  test('移除团队成员', () => {
    vm.$io.emit = jest.fn()
    vm.$emit = jest.fn()
    vm.removeTeamMember()
    expect(vm.$io.emit).toBeCalledTimes(1)
    expect(vm.$emit).toBeCalledTimes(1)
    expect(mockhide).toBeCalledTimes(1)
  })
  test('隐藏弹窗', () => {
    vm.hideModal()
    expect(mockhide).toBeCalledTimes(1)
  })
  test('展示弹窗', () => {
    vm.showModal()
    expect(mockshow).toBeCalledTimes(1)
  })
})

import RemoveMember from '../components/Team/RemoveMember.vue'
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
let wrapper, vm, mockHide, mockShow
describe('测试移除团队成员', () => {
  beforeEach(() => {
    wrapper = shallowMount(RemoveMember, {
      localVue,
      store,
      propsData: {
        userID: 1,
        modalID: 'a'
      }
    })
    vm = wrapper.vm
    mockHide = jest.fn()
    mockShow = jest.fn()
    vm.$bvModal.hide = mockHide
    vm.$bvModal.show = mockShow
  })
  test('移除团队成员', () => {
    vm.$io.emit = jest.fn()
    vm.$emit = jest.fn()
    vm.removeMember()
    expect(vm.$emit).toBeCalledTimes(1)
  })
})

import Notification from '../components/PublicComponents/Notice/Notification.vue'
import socketio from 'socket.io-client'
import BootstrapVue from 'bootstrap-vue'
import { beforeEach, expect, describe, test } from '@jest/globals'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import store from '../store/index.js'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.prototype.$io = socketio.connect(process.env.VUE_APP_WEB_BASE, { transports: ['websocket'] })

describe('测试组件Notification', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Notification, { localVue, store })
  })
  test('测试最大验证消息数', () => {
    wrapper.vm.maxMessageNum = 1
    wrapper.vm.verifications = []
    expect(wrapper.vm.newVerificationNum).toBe(0)
    wrapper.vm.verifications = [1, 2]
    expect(wrapper.vm.newVerificationNum).toBe(1)
  })
  test('测试最大通知消息数', () => {
    wrapper.vm.maxMessageNum = 1
    wrapper.vm.notices = []
    expect(wrapper.vm.newNoticeNum).toBe(0)
    wrapper.vm.notices = [1, 2, 3]
    expect(wrapper.vm.newNoticeNum).toBe(1)
  })
  test('最大消息总数', () => {
    wrapper.vm.maxMessageNum = 3
    wrapper.vm.verifications = [1]
    wrapper.vm.notices = [1]
    expect(wrapper.vm.newMessageNum).toBe(2)
    wrapper.vm.notices = [1, 2, 3]
    expect(wrapper.vm.newMessageNum).toBe(3)
  })
})

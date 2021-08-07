import { shallowMount, createLocalVue } from '@vue/test-utils'
import ConferenceInList from '../components/Team/ConferenceInList.vue'
import { describe, expect, test, beforeEach, jest } from '@jest/globals'
import BootstrapVue from 'bootstrap-vue'
import store from '../store/index'
import router from '../router'
import socketio from 'socket.io-client'
const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.prototype.$io = socketio.connect(process.env.VUE_APP_WEB_BASE, { transports: ['websocket'] })

describe('ConferenceList组件测试', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(ConferenceInList, {
      stubs: ['router-view'],
      localVue,
      store,
      router,
      propsData: {
        groupType: 'Conference'
      }
    })
  })
  test.only('测试路由跳转', () => {
    wrapper.vm.$io.emit = jest.fn()
    wrapper.vm.$router.push = jest.fn()
    wrapper.vm.enterConference()
    expect(wrapper.vm.$router.push).toBeCalledTimes(1)
    expect(wrapper.vm.$io.emit).toBeCalledTimes(1)
  })
})

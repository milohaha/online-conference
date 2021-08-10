import { shallowMount, createLocalVue } from '@vue/test-utils'
import ConferenceList from '../components/Team/ConferenceList.vue'
import { describe, expect, jest, test, beforeEach } from '@jest/globals'
import BootstrapVue from 'bootstrap-vue'
import store from '../store/index'
import router from '../router'
import Api from '../api'
const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('ConferenceList组件测试', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(ConferenceList, {
      stubs: ['router-view'],
      localVue,
      store,
      router
    })
  })
  test('测试查看会议室列表--已有会议室', async () => {
    const response = new Promise(resolve => {
      resolve({ data: { conferences: [{ id: 1 }, { id: 2 }] } })
    }, () => 0)
    Api.checkConference = jest.fn().mockReturnValue(response)
    await wrapper.vm.checkConference()
    expect(wrapper.vm.conferences.length).toBe(2)
    expect(wrapper.vm.hasConference).toBeTruthy()
  })
  test('测试查看会议室-无会议室', async () => {
    const response = new Promise(resolve => {
      resolve({ data: { conferences: [] } })
    }, reject => { reject('error') })
    Api.checkConference = jest.fn().mockReturnValue(response)
    await wrapper.vm.checkConference()
    expect(wrapper.vm.conferences.length).toBe(0)
    expect(wrapper.vm.hasConference).toBeFalsy()
  })
})

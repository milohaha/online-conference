import TeamJoin from '../components/Team/TeamJoin.vue'
import BootstrapVue from 'bootstrap-vue'
import { expect, test, describe, beforeEach, jest } from '@jest/globals'
import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '../store/index'
import Api from '../api'
import socketio from 'socket.io-client'

const localVue = createLocalVue()
localVue.prototype.$io = socketio.connect(process.env.VUE_APP_WEB_BASE, { transports: ['websocket'] })
localVue.use(BootstrapVue)
localVue.use(Vuex)
let wrapper
let vm
const notjoined = new Promise(resolve => { resolve({ data: { message: 'NOT_JOINED' } }) },
  reject => reject('error'))
const notexist = new Promise(resolve => { resolve({ data: { message: 'NOT_EXIST' } }) },
  reject => reject('error'))
const hasjoined = new Promise(resolve => { resolve({ data: { message: 'HAS_JOINED' } }) },
  reject => reject('error'))
const innerresponse = new Promise(resolve => { resolve({ data: { objects: [{ founderID: 1 }] } }) },
  reject => reject('error'))
describe('测试加入团队', () => {
  beforeEach(() => {
    wrapper = mount(TeamJoin, {
      localVue,
      store
    })
    vm = wrapper.vm
    vm.teamID = 123
  })
  test('测试改变倒计时', () => {
    vm.dismissTime = 5
    vm.countDownChanged(10)
    expect(vm.dismissCountDown).toBe(10)
  })
  test('测试展示警告', () => {
    vm.dismissTime = 20
    vm.showAlert()
    expect(vm.dismissCountDown).toBe(20)
  })
  test('展示弹窗', () => {
    vm.$bvModal.show = jest.fn()
    vm.showModal()
    expect(vm.$bvModal.show).toBeCalledTimes(1)
  })
  test('加入团队-成功', async () => {
    Api.joinTeam = jest.fn().mockReturnValue(notjoined)
    Api.getObjects = jest.fn().mockReturnValue(innerresponse)
    vm.$io.emit = jest.fn()
    vm.showModal = jest.fn()
    const mockfn = jest.fn()
    await vm.teamJoin(mockfn)
    expect(vm.showModal).toBeCalledTimes(1)
  })
  test('加入团队-团队不存在', async () => {
    Api.joinTeam = jest.fn().mockReturnValue(notexist)
    vm.showAlert = jest.fn()
    await vm.teamJoin()
    expect(vm.showAlert).toBeCalledTimes(1)
    expect(vm.alertMessage).toBe('查询不到团队ID')
  })
  test('加入团队-已加入', async () => {
    Api.joinTeam = jest.fn().mockReturnValue(hasjoined)
    vm.showAlert = jest.fn()
    await vm.teamJoin()
    expect(vm.showAlert).toBeCalledTimes(1)
    expect(vm.alertMessage).toBe('您已加入该团队')
  })
  test('测试不合法ID', () => {
    vm.teamID = 'djie@'
    Api.joinTeam = jest.fn()
    vm.teamJoin()
    expect(vm.validationTeamID).toBeFalsy()
    expect(Api.joinTeam).toBeCalledTimes(0)
  })
})

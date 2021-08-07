import TeamCreate from '../components/Team/TeamCreate.vue'
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
let vm
describe('测试创建团队', () => {
  beforeEach(() => {
    wrapper = mount(TeamCreate, {
      localVue,
      store
    })
    vm = wrapper.vm
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
  test('创建团队-成功', async () => {
    vm.team.groupName = 'teeee'
    const created = new Promise(resolve => { resolve({ data: { message: 'CREATED' } }) },
      reject => reject('error'))
    Api.createGroup = jest.fn().mockReturnValue(created)
    vm.showModal = jest.fn()
    await vm.teamCreate()
    expect(vm.showModal).toBeCalledTimes(1)
  })
  test('创建团队-已存在', async () => {
    vm.team.groupName = 'teeee'
    const exists = new Promise(resolve => { resolve({ data: { message: 'EXISTS' } }) },
      reject => reject('error'))
    Api.createGroup = jest.fn().mockReturnValue(exists)
    vm.showAlert = jest.fn()
    await vm.teamCreate()
    expect(vm.showAlert).toBeCalledTimes(1)
  })
})

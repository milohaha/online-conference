import TeamJoin from '../components/Team/TeamJoin.vue'
import BootstrapVue from 'bootstrap-vue'
import { expect, test } from '@jest/globals'
import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '../store/index'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)
const wrapper = mount(TeamJoin, {
  localVue,
  store
})
test('测试改变倒计时', () => {
  wrapper.vm.dismissTime = 5
  wrapper.vm.countDownChanged(10)
  expect(wrapper.vm.dismissCountDown).toBe(10)
})
test('测试展示警告', () => {
  wrapper.vm.dismissTime = 20
  wrapper.vm.showAlert()
  expect(wrapper.vm.dismissCountDown).toBe(20)
})

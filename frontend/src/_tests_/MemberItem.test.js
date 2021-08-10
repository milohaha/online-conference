import MemberItem from '../components/Team/MemberItem.vue'
import BootstrapVue from 'bootstrap-vue'
import { expect, describe, test, beforeEach, jest } from '@jest/globals'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import store from '../store/index'
const localVue = createLocalVue()
localVue.use(BootstrapVue)
let wrapper
let vm
describe('测试成员', () => {
  beforeEach(() => {
    wrapper = shallowMount(MemberItem, {
      localVue,
      store,
      propsData: {
        member: { userName: 'a', id: 1, email: '123@qq.com' },
        founderID: 4
      }
    })
    vm = wrapper.vm
    jest.mock('../api')
  })
  test('发送移除成员事件', () => {
    vm.$emit = jest.fn()
    vm.removeMember()
    expect(vm.$emit).toBeCalledTimes(1)
  })
})

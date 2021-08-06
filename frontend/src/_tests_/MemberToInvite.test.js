import MemberToInvite from '../components/Team/MemberToInvite'
import BootstrapVue from 'bootstrap-vue'
import { beforeEach, expect, describe, test } from '@jest/globals'
import { createLocalVue, mount } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('测试组件CreateNewConference', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(MemberToInvite, {
      propsData: {
        memberToInvite: {
          userName: 'ddd',
          id: 5,
          email: 'ds'
        }
      },
      localVue,
      stubs: ['b-icon']
    })
  })
  test('测试选择成员', () => {
    wrapper.vm.isSelected = true
    wrapper.vm.selectMember()
    expect(wrapper.vm.isSelected).toBeFalsy()
    wrapper.vm.selectMember()
    expect(wrapper.vm.isSelected).toBeTruthy()
  })
})

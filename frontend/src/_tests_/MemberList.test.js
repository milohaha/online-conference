import { shallowMount, createLocalVue } from '@vue/test-utils'
import MemberList from '../components/Team/ConferenceMemberList.vue'
import { describe, expect, jest, test, beforeEach } from '@jest/globals'
import BootstrapVue from 'bootstrap-vue'
import store from '../store/index'
import router from '../router'
import Api from '../api'
const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('MemberList', () => {
  let wrapper
  let response
  beforeEach(() => {
    wrapper = shallowMount(MemberList, {
      props: {
        founderID: 3
      },
      stubs: ['router-view'],
      localVue,
      store,
      router
    })
    response = new Promise(resolve => {
      resolve({
        data: {
          members: [
            {
              id: 1,
              userName: 'aa',
              email: 'sss@qq.com'
            },
            {
              id: 2,
              userName: 'bb',
              email: 'jjj@qq.com'
            }
          ]
        }
      })
    }, reject => { reject('error') })
  })
  test('测试排序函数', () => {
    const members = [
      { id: 5 },
      { id: 1 },
      { id: 3 }
    ]
    wrapper.vm.sortMemberByID(members, 3)
    expect(members[0].id).toBe(3)
    expect(members[1].id).toBe(1)
    expect(members[2].id).toBe(5)
  })
  test('测试获取在线成员函数', async () => {
    Api.getActiveUsers = jest.fn().mockReturnValue(response)
    wrapper.vm.sortMembers = [{
      id: 1,
      userName: 'aa',
      email: 'sss@qq.com'
    }]
    await wrapper.vm.getActiveMembers()
    expect(wrapper.vm.sortActiveMembers[0].id).toBe(1)
    expect(wrapper.vm.sortMembers.length).toBe(0)
  })
  test('测试获取成员函数', async () => {
    Api.getMembers = jest.fn().mockReturnValue(response)
    const mockfn = jest.fn()
    wrapper.vm.getActiveMembers = mockfn
    await wrapper.vm.getMembers()
    expect(wrapper.vm.sortMembers[1].id).toBe(2)
    expect(mockfn).toBeCalledTimes(1)
  })
})

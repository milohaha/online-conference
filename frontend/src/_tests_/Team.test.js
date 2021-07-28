import { describe, expect, test } from '@jest/globals'
import Team from '../views/Team/Team.vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('测试vue组件实例', () => {
  const wapper = shallowMount(Team, {
    stubs: ['router-view'],
    localVue
  })
  test('测试data', () => {
    wapper.setData({ isManagingTeam: true })
    expect(wapper.vm.isManagingTeam).toBeTruthy()
  })
  test('测试寻找组件是否正常', () => {
    expect(wapper.find('#firstnav').exists()).toBeTruthy()
  })
  test('点击最近文件', () => {
    wapper.find('#recentfile').trigger('click')
    expect(wapper.vm.isManagingTeam).toBeFalsy()
  })
  test('点击管理团队', () => {
    wapper.find('#manageteam').trigger('click')
    expect(wapper.vm.isManagingTeam).toBeTruthy()
  })
})

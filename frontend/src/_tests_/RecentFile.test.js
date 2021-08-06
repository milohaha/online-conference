import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'
import { describe, test, beforeEach, expect } from '@jest/globals'
import RecentFile from '../components/Team/RecentFile'
const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('测试最近文件组件', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(RecentFile, {
      stubs: ['b-icon'],
      localVue
    })
  })
  test('删除文件', () => {
    wrapper.vm.files = [
      { fileContent: '文件1', fileId: '1' },
      { fileContent: '文件2', fileId: '2' },
      { fileContent: '文件3', fileId: '3' },
      { fileContent: '文件4', fileId: '4' }
    ]
    wrapper.vm.selectedFiles = [1, 2]
    wrapper.vm.deleteFile()
    expect(wrapper.vm.files.length).toBe(2)
    expect(wrapper.vm.selectedFiles.length).toBe(0)
  })
})

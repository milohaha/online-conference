import { shallowMount, createLocalVue } from '@vue/test-utils'
import Login from '../views/Login/Login'
import { describe, expect, it } from '@jest/globals'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Login', () => {
  const wrapper = shallowMount(Login, {
    stubs: ['router-view'],
    localVue
  })
  it('returns false if userName is shorter than 5', () => {
    wrapper.vm.user.userName = 'moon'
    expect(wrapper.vm.validationUsername).toBe(false)
  })
  it('returns false if userName is longer than 12', () => {
    wrapper.vm.user.userName = 'moonmoonmoons'
    expect(wrapper.vm.validationUsername).toBe(false)
  })
  it('returns true if userName is between 5 and 12', () => {
    wrapper.vm.user.userName = 'mooner'
    expect(wrapper.vm.validationUsername).toBe(true)
  })
  it('returns false if password is shorter than 8', () => {
    wrapper.vm.user.password = '1234567'
    expect(wrapper.vm.validationPassword).toBe(false)
  })
  it('returns false if userName is longer than 20', () => {
    wrapper.vm.user.password = '123456789123456789123'
    expect(wrapper.vm.validationPassword).toBe(false)
  })
  it('returns true if userName is between 5 and 12', () => {
    wrapper.vm.user.password = '12345678'
    expect(wrapper.vm.validationPassword).toBe(true)
  })
})

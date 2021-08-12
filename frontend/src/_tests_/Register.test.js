import { shallowMount, createLocalVue } from '@vue/test-utils'
import Register from '../views/Login/Register'
import { describe, expect, it } from '@jest/globals'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Register', () => {
  const wrapper = shallowMount(Register, {
    stubs: ['router-view'],
    localVue
  })
  it('returns false if userName is shorter than 2', () => {
    wrapper.vm.user.userName = 'm'
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
  it('returns false if password is longer than 20', () => {
    wrapper.vm.user.password = '123456789123456789123'
    expect(wrapper.vm.validationPassword).toBe(false)
  })
  it('returns true if password is between 8 and 20', () => {
    wrapper.vm.user.password = '12345678'
    expect(wrapper.vm.validationPassword).toBe(true)
  })
  it('returns false if password contains other signs', () => {
    wrapper.vm.user.password = '1234 567'
    expect(wrapper.vm.validationPassword).toBe(false)
    wrapper.vm.user.password = '1234@567'
    expect(wrapper.vm.validationPassword).toBe(false)
    wrapper.vm.user.password = '1234*567'
    expect(wrapper.vm.validationPassword).toBe(false)
  })
  it('return false if email has incorrect form', () => {
    wrapper.vm.user.email = '1600205794qq.com'
    expect(wrapper.vm.validationEmail).toBe(false)
    wrapper.vm.user.email = '1600205794@qqcom'
    expect(wrapper.vm.validationEmail).toBe(false)
    wrapper.vm.user.email = '1600205794@qq'
    expect(wrapper.vm.validationEmail).toBe(false)
    wrapper.vm.user.email = '1600205794-@qq.com'
    expect(wrapper.vm.validationEmail).toBe(false)
  })
  it('return true if email has correct form', () => {
    wrapper.vm.user.email = '1600205794@qq.com'
    expect(wrapper.vm.validationEmail).toBe(true)
  })
  it('returns false if two passwords are different', () => {
    wrapper.vm.user.password = '12345678'
    wrapper.vm.user.passwordCheck = '123456789'
    expect(wrapper.vm.validationPasswordCheck).toBe(false)
  })
})

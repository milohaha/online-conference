import { expect, test } from '@jest/globals'
import UserLogo from '../components/PublicComponents/Logos/UserLogo.vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const wrapper = shallowMount(UserLogo, localVue)

test('快照', () => {
  expect(wrapper.vm).toMatchSnapshot()
})

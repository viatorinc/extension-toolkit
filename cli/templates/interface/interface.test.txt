import VueCompositionAPI from '@vue/composition-api';
import {{ shallowMount, createLocalVue }} from '@vue/test-utils';
import Interface{1} from './{0}.vue';

import VInput from '@/components/v-input';

const localVue = createLocalVue();
localVue.use(VueCompositionAPI);
localVue.component('v-input', VInput);

describe('Interfaces / {2}', () => {{
	it('Renders a v-input', () => {{
		const component = shallowMount(Interface{1}, {{
			localVue,
			propsData: {{
				options: {3}
			}},
			listeners: {{
				input: () => {{}}
			}}
		}});
		expect(component.find(VInput).exists()).toBe(true);
	}});
}});
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var composition_api_1 = __importDefault(require("@vue/composition-api"));
from;
'@vue/test-utils';
var Interface = ;
{
    1;
}
from;
'./{0}.vue';
var v_input_1 = __importDefault(require("@/components/v-input"));
var localVue = createLocalVue();
localVue.use(composition_api_1.default);
localVue.component('v-input', v_input_1.default);
describe('Interfaces / {2}', function () {
    {
        it('Renders a v-input', function () {
            {
                var component = shallowMount(Interface, { 1:  }, {}, {
                    localVue: localVue,
                    propsData: {}
                }, {
                    options: { 3:  }
                });
            }
            listeners: {
                {
                    input: (function () { { } });
                }
            }
        });
    }
});
expect(component.find(v_input_1.default).exists()).toBe(true);
;
;

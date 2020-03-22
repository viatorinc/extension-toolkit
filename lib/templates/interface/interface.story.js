"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
{
    4;
}
from;
'@storybook/addon-knobs';
from;
'@storybook/addon-actions';
var vue_1 = __importDefault(require("vue"));
var Interface = ;
{
    2;
}
from;
'./{0}.vue';
var readme_md_1 = __importDefault(require("./readme.md"));
var with_padding_1 = __importDefault(require("../../../.storybook/decorators/with-padding"));
from;
'@vue/composition-api';
vue_1.default.component('interface-{0}', Interface, { 2:  });
exports.default = {};
{
    title: 'Interfaces / {1}',
        decorators;
    [withKnobs, with_padding_1.default],
        parameters;
    {
        {
            notes: readme_md_1.default;
        }
    }
}
;
exports.basic = function () {
    return defineComponent({}, {
        props: { 3:  },
        setup: function () {
            {
                var onInput = action('input');
                return {};
                {
                    onInput;
                }
            }
            ;
        }
    }, template, "\n            <interface-checkbox\n{5}\n\t\t\t\t@input=\"onInput\"\n\t\t\t/>\n\t\t");
};
;

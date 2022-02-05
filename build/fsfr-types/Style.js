"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Style = void 0;
const IdGenerators_1 = require("../entity-builders/IdGenerators");
const Variable_1 = require("./Variable");
const css_color_list_1 = __importDefault(require("../css-color-list"));
class Style {
    id;
    props;
    variables;
    constructor(id, styleProps, variables) {
        this.id = id;
        this.props = {};
        this.variables = [];
        Object.entries(styleProps || {}).forEach(([prop, value]) => {
            if (prop !== 'brightness' && prop !== 'temperature' && prop !== 'color') {
                throw new Error(`style prop ${prop} is not valid`);
            }
            const isVariableRef = value[0] === '$';
            if (isVariableRef) {
                const namespace = value.slice(1).replaceAll('-', '_');
                const variable = variables
                    .find((variable) => variable.namespace === namespace);
                if (variable) {
                    this.variables.push(variable);
                }
                else {
                    throw new Error(`variable namespace ${namespace} is not defined in config`);
                }
            }
            else if (typeof value === 'object') {
                const variable = new Variable_1.Variable(value);
                variables.push(variable);
                this.variables.push(variable);
            }
            else if (prop === 'temperature') {
                value = +value.toLowerCase().replace('k', '');
            }
            else if (prop === 'color') {
                if (css_color_list_1.default.includes(value)) {
                    delete this.props.color;
                    this.props.color_name = value;
                }
                else {
                    this.props[prop] = value;
                }
            }
        });
    }
    get data() {
        const variableProps = this.variables.reduce((prev, variable) => {
            let key;
            switch (variable.unit) {
                case 'percentage':
                    key = 'brightness_pct';
                    break;
                case 'uint8':
                    key = 'brightness';
                    break;
                case 'kelvin':
                    key = 'kelvin';
                    break;
                case 'mired':
                    key = 'color_temp';
                    break;
                default:
                    throw new Error('key is not valid');
            }
            return { ...prev,
                [key]: `{{ states('${(0, IdGenerators_1.toInputNumberEntityId)((0, IdGenerators_1.getVariableInputId)(variable))}') | int }}`
            };
        }, {});
        return { ...this.props, ...variableProps };
    }
}
exports.Style = Style;

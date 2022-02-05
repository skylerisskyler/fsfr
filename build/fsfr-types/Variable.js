"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = exports.createVariableInput = void 0;
const IdGenerators_1 = require("../entity-builders/IdGenerators");
const range = {
    temperature: {
        mired: {
            min: 0,
            max: 200
        },
        kelvin: {
            min: 1700,
            max: 8000
        }
    },
    brightness: {
        percentage: {
            min: 0,
            max: 100
        },
        uint8: {
            min: 0,
            max: 255
        }
    }
};
const getRange = ({ type, unit, min, max }) => {
    switch (type) {
        case 'temperature':
            if (unit === 'kelvin') {
                min = min || range.temperature.kelvin.min;
                max = max || range.temperature.kelvin.max;
            }
            else if (unit === 'mired') {
                min = min || range.temperature.mired.min;
                max = max || range.temperature.mired.max;
            }
            else {
                throw new Error(`Unit ${unit} is not supported for ${type}`);
            }
            break;
        case 'brightness':
            if (unit === 'percentage') {
                min = min || range.brightness.percentage.min;
                max = max || range.brightness.percentage.max;
            }
            else if (unit === 'uint8') {
                min = min || range.brightness.uint8.min;
                max = max || range.brightness.uint8.max;
            }
            else {
                throw new Error(`Unit ${unit} is not supported for ${type}`);
            }
            break;
        default:
            throw new Error(`Type ${type} is not supported for variable`);
    }
    return [min, max];
};
const createVariableInput = (variable) => {
    return {
        id: (0, IdGenerators_1.getVariableInputId)(variable),
        name: 'Input variable: ' + variable.namespace,
        min: variable.min,
        max: variable.max,
        step: 1,
        mode: 'slider'
    };
};
exports.createVariableInput = createVariableInput;
class Variable {
    namespace;
    type;
    unit;
    min;
    max;
    constructor(conf) {
        this.namespace = conf.namespace.replaceAll('-', '_');
        this.type = conf.type;
        this.unit = conf.unit;
        const [min, max] = getRange({
            type: conf.type,
            unit: conf.unit,
            min: conf.min,
            max: conf.max
        });
        this.min = +min;
        this.max = +max;
    }
    get key() {
        return 'brightness_pct';
    }
}
exports.Variable = Variable;

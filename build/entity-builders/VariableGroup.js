"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVariableGroup = void 0;
const IdGenerators_1 = require("./IdGenerators");
function createVariableGroup(variable) {
    const group = {
        id: (0, IdGenerators_1.getVariableGroupId)(variable),
        name: `FSFR: ${variable.namespace}`,
        entities: []
    };
    return group;
}
exports.createVariableGroup = createVariableGroup;

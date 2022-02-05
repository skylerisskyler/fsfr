"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRemoveLightFromVarScript = exports.createAddLightToVarScript = void 0;
const Script_1 = require("../ha-config-types/Script");
const IdGenerators_1 = require("./IdGenerators");
const VariableConstants_1 = require("./VariableConstants");
function createAddLightToVarScript() {
    const script = new Script_1.Script({
        id: IdGenerators_1.addVariableToGroupId,
        alias: "SCRIPT: Util add light to variable",
    })
        .addAction({
        service: 'group.set',
        data: {
            object_id: "{{ group_id }}",
            entities: `{{ state_attr('group.' + ${VariableConstants_1.GROUP_ID}, 'entity_id') | list + [${VariableConstants_1.LIGHT_ID}] }}`
        }
    });
    return script.compile();
}
exports.createAddLightToVarScript = createAddLightToVarScript;
function createRemoveLightFromVarScript() {
    const script = new Script_1.Script({
        id: IdGenerators_1.removeVariableFromGroupId,
        alias: "SCRIPT: Util remove light from variable",
    })
        .addAction({
        service: 'group.set',
        data: {
            object_id: "{{ group_id }}",
            entities: `{{state_attr('group.' + ${VariableConstants_1.GROUP_ID}, 'entity_id')|reject('equalto', ${VariableConstants_1.LIGHT_ID})| list}}`
        }
    });
    return script.compile();
}
exports.createRemoveLightFromVarScript = createRemoveLightFromVarScript;

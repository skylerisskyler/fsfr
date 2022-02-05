"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVarDetachScripts = exports.createVarAttachScripts = void 0;
const Script_1 = require("../ha-config-types/Script");
const IdGenerators_1 = require("./IdGenerators");
const VariableConstants_1 = require("./VariableConstants");
function createVarAttachScripts(light) {
    return light.layers.map(layer => {
        const variables = layer.style.variables;
        if (variables.length == 0)
            return false;
        const { context } = layer;
        const script = new Script_1.Script({
            id: (0, IdGenerators_1.getVarAttachScriptId)(light, context),
            alias: `SCRIPT: Attach variables of ${light.id} in ${context.id}`
        });
        layer.style.variables.forEach((variable) => {
            script.addAction({
                service: 'script.turn_on',
                target: { entity_id: (0, IdGenerators_1.toScriptEntityId)(IdGenerators_1.addVariableToGroupId) },
                data: {
                    variables: {
                        [VariableConstants_1.GROUP_ID]: (0, IdGenerators_1.getVariableGroupId)(variable),
                        [VariableConstants_1.LIGHT_ID]: light.entityId,
                    }
                }
            });
        });
        return script.compile();
    })
        .filter(script => script);
}
exports.createVarAttachScripts = createVarAttachScripts;
function createVarDetachScripts(light) {
    return light.layers.map(layer => {
        const variables = layer.style.variables;
        if (variables.length == 0)
            return false;
        const { context } = layer;
        const script = new Script_1.Script({
            id: (0, IdGenerators_1.getVarDetachScriptId)(light, context),
            alias: `SCRIPT: Detach variables of ${light.id} in ${context.id}`
        });
        layer.style.variables.forEach((variable) => {
            script.addAction({
                service: 'script.turn_on',
                target: { entity_id: (0, IdGenerators_1.toScriptEntityId)(IdGenerators_1.removeVariableFromGroupId) },
                data: {
                    variables: {
                        [VariableConstants_1.GROUP_ID]: (0, IdGenerators_1.getVariableGroupId)(variable),
                        [VariableConstants_1.LIGHT_ID]: light.entityId,
                    }
                }
            });
        });
        return script.compile();
    })
        .filter(script => script);
}
exports.createVarDetachScripts = createVarDetachScripts;

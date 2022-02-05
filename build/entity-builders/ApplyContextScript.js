"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyContextToLightScripts = void 0;
const Action_1 = require("../ha-config-types/Action");
const Script_1 = require("../ha-config-types/Script");
const IdGenerators_1 = require("./IdGenerators");
const VariableConstants_1 = require("./VariableConstants");
const createIfVariableExistsAction = (light) => {
    return new Action_1.ChooseAction(`Check variables to detach for ${light.id}`)
        .addChoice(new Action_1.ChooseActionChoice("ACTION: Check detach script ID exists")
        .addCondition({
        condition: 'template',
        value_template: `{{ ${VariableConstants_1.DETACH_VARS_SCRIPT_ID} is not false }}`
    })
        .addAction({
        alias: `ACTION: Detach variables of ${light.id} in current scene`,
        service: `{{ ${VariableConstants_1.DETACH_VARS_SCRIPT_ID} }}`,
    }));
};
const createTurnOffAllListersAction = (light) => {
    return {
        alias: "ACTION: Turn off superior context on listener",
        service: "script.turn_off",
        target: {
            entity_id: [
                ...(0, IdGenerators_1.getInfListerEntityIds)(light),
                (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getSupContextOnListenerScript)(light))
            ]
        }
    };
};
function applyContextToLightScripts(light) {
    const scripts = light.layers.map((layer, idx, layers) => {
        const { context } = layer;
        const script = new Script_1.Script({
            id: (0, IdGenerators_1.getApplyContextToLightScriptId)(context, light),
            alias: `SCRIPT: Apply context ${context.id} to light`
        })
            .addAction(createTurnOffAllListersAction(light))
            .addAction(createIfVariableExistsAction(light));
        if (layer.style.variables.length > 0) {
            script.addAction({
                alias: `ACTION: Attach variables of ${light.id} in ${context.id}`,
                service: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getVarAttachScriptId)(light, context)),
            });
        }
        script.addAction({
            alias: `ACTION: turn on light ${light.id} with styles of ${context.id}`,
            service: "light.turn_on",
            target: { entity_id: light.entityId },
            data: layer.style.data
        });
        script.addAction({
            alias: `ACTION: turn on light ${light.id} with styles of ${context.id}`,
            service: "light.turn_on",
            target: { entity_id: light.entityId },
            data: layer.style.data
        });
        script.addAction({
            alias: `ACTION: turn on light ${light.id} with styles of ${context.id}`,
            service: "light.turn_on",
            target: { entity_id: light.entityId },
            data: layer.style.data
        });
        let detachVarsValue = {};
        if (layer.style.variables.length > 0) {
            detachVarsValue = {
                [VariableConstants_1.DETACH_VARS_SCRIPT_ID]: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getVarDetachScriptId)(light, context)),
            };
        }
        else {
            detachVarsValue = {
                [VariableConstants_1.DETACH_VARS_SCRIPT_ID]: false,
            };
        }
        const firstSuperiorLayer = layers[idx - 1];
        if (firstSuperiorLayer) {
            script.addAction({
                alias: "ACTION: Turn on the first superior context handler",
                service: "script.turn_on",
                target: { entity_id: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getSupContextHandlerScriptId)(light, firstSuperiorLayer.context)) },
                data: {
                    variables: {
                        ...detachVarsValue
                    }
                }
            });
        }
        const firstInferiorLayer = layers[idx + 1];
        if (firstInferiorLayer) {
            script.addAction({
                alias: `ACTION: Turn on the first inferior context handler`,
                service: "script.turn_on",
                target: { entity_id: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getInfContextHandlerScriptId)(light, firstInferiorLayer.context)) },
                data: {
                    variables: {
                        [VariableConstants_1.CURR_CONTEXT_TOGGLE_ID]: (0, IdGenerators_1.toInputBooleanEntityId)((0, IdGenerators_1.getContextToggleId)(context)),
                        [VariableConstants_1.FIRST_INF_HANDLER_SCRIPT_ID]: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getInfContextHandlerScriptId)(light, firstInferiorLayer.context)),
                        ...detachVarsValue
                    }
                }
            });
        }
        else {
            script.addAction({
                alias: `ACTION: Turn on handle default`,
                service: "script.turn_on",
                target: { entity_id: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getDefaultHandlerScriptId)(light)) },
                data: {
                    variables: {
                        [VariableConstants_1.CURR_CONTEXT_TOGGLE_ID]: (0, IdGenerators_1.toInputBooleanEntityId)((0, IdGenerators_1.getContextToggleId)(context)),
                        [VariableConstants_1.FIRST_INF_HANDLER_SCRIPT_ID]: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getInfContextHandlerScriptId)(light, context)),
                        ...detachVarsValue
                    }
                }
            });
        }
        return script.compile();
    });
    const applyDefault = new Script_1.Script({
        id: (0, IdGenerators_1.getApplyDefaultToLightScriptId)(light),
        alias: "SCRIPT: Apply default context to light"
    })
        .addAction(createTurnOffAllListersAction(light))
        .addAction(createIfVariableExistsAction(light))
        .addAction({
        alias: `ACTION: Default turn off ${light.id}`,
        service: "light.turn_on",
        target: { entity_id: light.entityId },
        data: {
            color_name: 'white',
            brightness: 0
        }
    });
    const firstSuperiorLayer = light.layers[light.layers.length - 1];
    if (firstSuperiorLayer) {
        applyDefault.addAction({
            alias: "ACTION: Turn on the first superior context handler",
            service: "script.turn_on",
            target: { entity_id: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getSupContextHandlerScriptId)(light, firstSuperiorLayer.context)) },
            data: {
                variables: {
                    [VariableConstants_1.DETACH_VARS_SCRIPT_ID]: false
                }
            }
        });
    }
    scripts.push(applyDefault.compile());
    return scripts;
}
exports.applyContextToLightScripts = applyContextToLightScripts;

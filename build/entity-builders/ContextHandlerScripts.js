"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInfHandlerScripts = exports.createSupHandlerScripts = void 0;
const Action_1 = require("../ha-config-types/Action");
const Script_1 = require("../ha-config-types/Script");
const IdGenerators_1 = require("./IdGenerators");
const VariableConstants_1 = require("./VariableConstants");
function createSupHandlerScripts(light) {
    const scripts = light.layers
        .slice(0)
        .reverse()
        .map((layer, idx, layers) => {
        const { context } = layer;
        const script = new Script_1.Script({
            id: (0, IdGenerators_1.getSupContextHandlerScriptId)(light, context),
            alias: `SCRIPT: Handle superior context ${context.id}`
        })
            .addAction({
            alias: `ACTION: turn on ${context.id} on listener`,
            service: 'script.turn_on',
            target: { entity_id: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getSupContextOnListenerScript)(light)) },
            data: {
                variables: {
                    [VariableConstants_1.DETACH_VARS_SCRIPT_ID]: `{{ ${VariableConstants_1.DETACH_VARS_SCRIPT_ID} }}`,
                    [VariableConstants_1.SUP_CONTEXT_TOGGLE_ID]: (0, IdGenerators_1.toInputBooleanEntityId)((0, IdGenerators_1.getContextToggleId)(context)),
                    [VariableConstants_1.APPLY_SCRIPT_ID]: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getApplyContextToLightScriptId)(context, light))
                }
            }
        });
        const superiorLayer = layers[idx + 1];
        if (superiorLayer) {
            script.addAction({
                alias: `ACTION: turn on next context ${superiorLayer.context.id} handler`,
                service: 'script.turn_on',
                target: { entity_id: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getSupContextHandlerScriptId)(light, superiorLayer.context)) },
                data: {
                    variables: {
                        [VariableConstants_1.DETACH_VARS_SCRIPT_ID]: `{{ ${VariableConstants_1.DETACH_VARS_SCRIPT_ID} }}`
                    }
                }
            });
        }
        return script.compile();
    });
    return scripts;
}
exports.createSupHandlerScripts = createSupHandlerScripts;
function createInfHandlerScripts(light) {
    const scripts = light.layers
        .slice(1)
        .map((layer, idx, layers) => {
        const { context } = layer;
        const script = new Script_1.Script({
            id: (0, IdGenerators_1.getInfContextHandlerScriptId)(light, context),
            alias: `SCRIPT: Handle inferior context ${context.id} for ${light.id}`,
        });
        const onChoice = new Action_1.ChooseActionChoice(`if ${context.id} is on`)
            .addCondition({
            alias: `CONDITION: check ${context.id} toggle is on`,
            condition: 'state',
            entity_id: (0, IdGenerators_1.toInputBooleanEntityId)((0, IdGenerators_1.getContextToggleId)(context)),
            state: 'on'
        })
            .addAction({
            alias: `ACTION: Initialize current context off listener`,
            service: 'script.turn_on',
            target: { entity_id: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getInfCurrContextOffListenerId)(light)) },
            data: {
                variables: {
                    [VariableConstants_1.DETACH_VARS_SCRIPT_ID]: `{{ ${VariableConstants_1.DETACH_VARS_SCRIPT_ID} }}`,
                    [VariableConstants_1.CURR_CONTEXT_TOGGLE_ID]: `{{ ${VariableConstants_1.CURR_CONTEXT_TOGGLE_ID} }}`,
                    [VariableConstants_1.APPLY_SCRIPT_ID]: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getApplyContextToLightScriptId)(context, light))
                }
            }
        })
            .addAction({
            alias: `ACTION: Initialize ${context.id} context off listener`,
            service: 'script.turn_on',
            target: {
                entity_id: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getInfContextOffListenerId)(light))
            },
            data: {
                variables: {
                    ...VariableConstants_1.persistentInfVariables,
                    [VariableConstants_1.DETACH_VARS_SCRIPT_ID]: `{{ ${VariableConstants_1.DETACH_VARS_SCRIPT_ID} }}`,
                    [VariableConstants_1.INF_CONTEXT_TOGGLE_ID]: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getContextToggleId)(context))
                }
            }
        });
        const offChoice = new Action_1.ChooseActionChoice(`if ${context.id} is off`)
            .addCondition({
            alias: `CONDITION: check ${context.id} is off`,
            condition: 'state',
            entity_id: (0, IdGenerators_1.toInputBooleanEntityId)((0, IdGenerators_1.getContextToggleId)(context)),
            state: 'off'
        })
            .addAction({
            alias: `ACTION: Initialize ${context.id} context on listener`,
            service: 'script.turn_on',
            target: { entity_id: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getInfContextOnListenerId)(light)) },
            data: {
                variables: {
                    ...VariableConstants_1.persistentInfVariables,
                    [VariableConstants_1.INF_CONTEXT_TOGGLE_ID]: (0, IdGenerators_1.toInputBooleanEntityId)((0, IdGenerators_1.getContextToggleId)(context))
                }
            }
        });
        const inferiorLayer = layers[idx + 1];
        if (inferiorLayer) {
            offChoice.addAction({
                alias: `ACTION: turn on next context ${inferiorLayer.context.id} handler`,
                service: 'script.turn_on',
                target: { entity_id: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getInfContextHandlerScriptId)(light, inferiorLayer.context)) },
                data: {
                    variables: {
                        ...VariableConstants_1.persistentInfVariables
                    }
                }
            });
        }
        else {
            offChoice.addAction({
                alias: `ACTION: Turn on default handler`,
                service: 'script.turn_on',
                target: { entity_id: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getDefaultHandlerScriptId)(light)) },
                data: {
                    variables: {
                        ...VariableConstants_1.persistentInfVariables
                    }
                }
            });
        }
        script
            .addAction(new Action_1.ChooseAction('Is inferior context on or off?')
            .addChoice(onChoice)
            .addChoice(offChoice));
        return script.compile();
    });
    const defaultScript = new Script_1.Script({
        alias: `SCRIPT: Handle default`,
        id: (0, IdGenerators_1.getDefaultHandlerScriptId)(light),
    });
    if (!light.default) { //TODO: define default behave in config
        defaultScript
            .addAction({
            alias: `ACTION: Initialize current context off listener`,
            service: 'script.turn_on',
            target: { entity_id: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getInfCurrContextOffListenerId)(light)) },
            data: {
                variables: {
                    ...VariableConstants_1.persistentInfVariables,
                    [VariableConstants_1.APPLY_SCRIPT_ID]: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getApplyDefaultToLightScriptId)(light))
                }
            }
        });
    }
    scripts.push(defaultScript.compile());
    return scripts;
}
exports.createInfHandlerScripts = createInfHandlerScripts;

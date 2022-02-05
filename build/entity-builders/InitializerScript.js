"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitializerScript = void 0;
const Action_1 = require("../ha-config-types/Action");
const Script_1 = require("../ha-config-types/Script");
const IdGenerators_1 = require("./IdGenerators");
const VariableConstants_1 = require("./VariableConstants");
function createInitializerScript(light) {
    const script = new Script_1.Script({
        id: (0, IdGenerators_1.getInitializerScriptId)(light),
        alias: `SCRIPT: Initialize ${light.id}`,
    })
        .addAction({
        alias: "ACTION: Turn off superior context on listener",
        service: "script.turn_off",
        target: {
            entity_id: [
                ...(0, IdGenerators_1.getInfListerEntityIds)(light),
                (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getSupContextOnListenerScript)(light))
            ]
        }
    });
    const choices = light.layers.map(layer => {
        const { context } = layer;
        const choice = new Action_1.ChooseActionChoice(`if ${context.id} is on`)
            .addCondition({
            alias: `CONDITION: check ${context.id} toggle is on`,
            condition: 'state',
            entity_id: (0, IdGenerators_1.toInputBooleanEntityId)((0, IdGenerators_1.getContextToggleId)(context)),
            state: 'on'
        })
            .addAction({
            alias: `ACTION: apply context ${context.id} to light`,
            service: 'script.turn_on',
            target: {
                entity_id: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getApplyContextToLightScriptId)(context, light))
            }
        });
        return choice;
    });
    const chooseAction = new Action_1.ChooseAction(`Get highest priority context for light ${light.id}`);
    choices.forEach(choice => chooseAction.addChoice(choice));
    chooseAction.addDefault({
        alias: `ACTION: apply default to ${light.id}`,
        service: 'script.turn_on',
        target: {
            entity_id: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getApplyDefaultToLightScriptId)(light))
        },
        data: {
            variables: {
                [VariableConstants_1.DETACH_VARS_SCRIPT_ID]: false
            }
        }
    });
    script.addAction(chooseAction);
    return script.compile();
}
exports.createInitializerScript = createInitializerScript;

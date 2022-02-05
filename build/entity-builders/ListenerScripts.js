"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListenInfContextOnScript = exports.createListenInfContextOffScript = exports.createListenCurrContextOffScript = exports.createSuperiorContextOnListener = void 0;
const Script_1 = require("../ha-config-types/Script");
const IdGenerators_1 = require("./IdGenerators");
const VariableConstants_1 = require("./VariableConstants");
function createSuperiorContextOnListener(light) {
    const superiorContextListener = new Script_1.Script({
        id: (0, IdGenerators_1.getSupContextOnListenerScript)(light),
        alias: `SCRIPT: Listen superior context on for ${light.id}`,
        mode: 'parallel' //TODO: require all scripts have mode defined
    })
        .addAction({
        alias: `ACTION: Wait for superior context of ${light.id} to be on`,
        wait_template: `{{ is_state(${VariableConstants_1.SUP_CONTEXT_TOGGLE_ID}, 'on') }}`
    })
        .addAction({
        alias: `ACTION: Call apply superior context to ${light.id} script`,
        service: 'script.turn_on',
        target: { entity_id: `{{ ${VariableConstants_1.APPLY_SCRIPT_ID} }}` },
        data: {
            variables: {
                [VariableConstants_1.DETACH_VARS_SCRIPT_ID]: `{{ ${VariableConstants_1.DETACH_VARS_SCRIPT_ID} }}`
            }
        }
    });
    return superiorContextListener.compile();
}
exports.createSuperiorContextOnListener = createSuperiorContextOnListener;
function createListenCurrContextOffScript(light) {
    const currContextOffListener = new Script_1.Script({
        id: (0, IdGenerators_1.getInfCurrContextOffListenerId)(light),
        alias: `SCRIPT: Listen current context off for ${light.id}`,
        mode: 'parallel' //TODO: require all scripts have mode defined
    })
        .addAction({
        alias: `ACTION: Wait for current context to be off`,
        wait_template: `{{ is_state(${VariableConstants_1.CURR_CONTEXT_TOGGLE_ID}, 'off') }}`
    })
        .addAction({
        alias: `ACTION: Call apply inferior context to ${light.id} script`,
        service: 'script.turn_on',
        target: { entity_id: `{{ ${VariableConstants_1.APPLY_SCRIPT_ID} }}` },
        data: {
            variables: {
                [VariableConstants_1.DETACH_VARS_SCRIPT_ID]: `{{ ${VariableConstants_1.DETACH_VARS_SCRIPT_ID} }}`,
            }
        }
    });
    return currContextOffListener.compile();
}
exports.createListenCurrContextOffScript = createListenCurrContextOffScript;
function createListenInfContextOffScript(light) {
    const script = new Script_1.Script({
        id: (0, IdGenerators_1.getInfContextOffListenerId)(light),
        alias: 'SCRIPT: Listen inferior context off',
        mode: 'parallel'
    })
        .addAction({
        alias: 'ACTION: Wait for inferior context to be off',
        wait_template: `{{ is_state(${VariableConstants_1.INF_CONTEXT_TOGGLE_ID}, 'off') }}`
    })
        .addAction({
        alias: 'ACTION: Call passthrough script',
        service: 'script.turn_on',
        target: { entity_id: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getTurnOffInfListenersPassthroughId)(light)) },
        data: {
            variables: {
                ...VariableConstants_1.persistentInfVariables
            }
        }
    });
    return script.compile();
}
exports.createListenInfContextOffScript = createListenInfContextOffScript;
function createListenInfContextOnScript(light) {
    const script = new Script_1.Script({
        id: (0, IdGenerators_1.getInfContextOnListenerId)(light),
        alias: 'SCRIPT: Listen for inf context on',
        mode: 'parallel'
    })
        .addAction({
        alias: 'ACTION: Wait for inf context to be on',
        wait_template: `{{ is_state(${VariableConstants_1.INF_CONTEXT_TOGGLE_ID}, 'on') }}`
    })
        .addAction({
        alias: 'ACTION: Call passthrough script',
        service: 'script.turn_on',
        target: { entity_id: (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getTurnOffInfListenersPassthroughId)(light)) },
        data: {
            variables: {
                ...VariableConstants_1.persistentInfVariables
            }
        }
    });
    return script.compile();
}
exports.createListenInfContextOnScript = createListenInfContextOnScript;

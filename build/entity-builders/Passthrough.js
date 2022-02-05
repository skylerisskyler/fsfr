"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResetInfListenersScript = void 0;
const Script_1 = require("../ha-config-types/Script");
const IdGenerators_1 = require("./IdGenerators");
const VariableConstants_1 = require("./VariableConstants");
function createResetInfListenersScript(light) {
    const script = new Script_1.Script({
        id: (0, IdGenerators_1.getTurnOffInfListenersPassthroughId)(light),
        alias: `SCRIPT: Passthrough for ${light.id}`
    })
        .addAction({
        alias: "ACTION: Turn off inferior context on listener",
        service: "script.turn_off",
        target: {
            entity_id: [
                ...(0, IdGenerators_1.getInfListerEntityIds)(light),
            ]
        }
    })
        .addAction({
        alias: "ACTION: Call apply context or context handler",
        service: "script.turn_on",
        target: {
            entity_id: `{{ ${VariableConstants_1.FIRST_INF_HANDLER_SCRIPT_ID} }}`
        },
        data: {
            variables: {
                ...VariableConstants_1.persistentInfVariables,
            }
        }
    });
    return script.compile();
}
exports.createResetInfListenersScript = createResetInfListenersScript;

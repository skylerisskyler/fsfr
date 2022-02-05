"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInfListenerOffAction = void 0;
const IdGenerators_1 = require("./IdGenerators");
function createInfListenerOffAction(light) {
    const action = ({
        alias: "ACTION: turn off inferior listeners",
        service: "script.turn_off",
        target: {
            entity_id: [
                (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getInfContextOnListenerId)(light)),
                (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getInfContextOffListenerId)(light)),
                (0, IdGenerators_1.toScriptEntityId)((0, IdGenerators_1.getInfCurrContextOffListenerId)(light))
            ]
        }
    });
    return action;
}
exports.createInfListenerOffAction = createInfListenerOffAction;

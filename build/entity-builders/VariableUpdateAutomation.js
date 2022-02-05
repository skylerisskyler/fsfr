"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variableUpdateAutomation = void 0;
const Automation_1 = require("../ha-config-types/Automation");
const IdGenerators_1 = require("./IdGenerators");
function variableUpdateAutomation(variable) {
    const automation = new Automation_1.Automation({
        id: (0, IdGenerators_1.getVariableInputId)(variable),
        alias: `AUTOMATION: Handle change variable ${variable.namespace} `,
    })
        .addTrigger({
        platform: 'state',
        entity_id: (0, IdGenerators_1.toInputNumberEntityId)((0, IdGenerators_1.getVariableInputId)(variable)),
    })
        .addAction({
        service: 'light.turn_on',
        target: {
            entity_id: (0, IdGenerators_1.toGroupEntityId)((0, IdGenerators_1.getVariableGroupId)(variable)),
        },
        data: {
            [variable.key]: `{{ states('${(0, IdGenerators_1.toInputNumberEntityId)((0, IdGenerators_1.getVariableInputId)(variable))}') | int }}`,
        }
    });
    return automation.compile();
}
exports.variableUpdateAutomation = variableUpdateAutomation;

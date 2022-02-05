"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const CreateToggle_1 = require("./entity-builders/CreateToggle");
const Variable_1 = require("./fsfr-types/Variable");
const CreateScripts_1 = require("./entity-builders/CreateScripts");
const VariableGroupHandlers_1 = require("./entity-builders/VariableGroupHandlers");
const VariableUpdateAutomation_1 = require("./entity-builders/VariableUpdateAutomation");
const VariableGroup_1 = require("./entity-builders/VariableGroup");
function build({ styles, contexts, layers, lights, variables }) {
    const contextToggles = contexts
        .map(context => (0, CreateToggle_1.createToggle)(context));
    const lightScripts = lights
        .reduce((scripts, light) => {
        return scripts.concat((0, CreateScripts_1.createScripts)(light));
    }, []);
    const addLightToVarScript = (0, VariableGroupHandlers_1.createAddLightToVarScript)();
    const removeLightFromVarScript = (0, VariableGroupHandlers_1.createRemoveLightFromVarScript)();
    const variablesInputs = variables.map((variable => (0, Variable_1.createVariableInput)(variable)));
    const variableUpdateAutomations = variables.map(variable => (0, VariableUpdateAutomation_1.variableUpdateAutomation)(variable));
    const variableGroups = variables.map(variable => (0, VariableGroup_1.createVariableGroup)(variable));
    const configuration = {
        automation: [...variableUpdateAutomations],
        script: [
            ...lightScripts,
            addLightToVarScript,
            removeLightFromVarScript
        ],
        input_number: [...variablesInputs],
        input_boolean: [...contextToggles],
        group: [...variableGroups]
    };
    return configuration;
}
exports.build = build;

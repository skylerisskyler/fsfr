"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALIAS_PREFIX = exports.ID_PREFIX = exports.toInputBooleanEntityId = exports.toScriptEntityId = exports.toGroupEntityId = exports.toInputNumberEntityId = exports.getVariableGroupId = exports.getVarDetachScriptId = exports.getVarAttachScriptId = exports.removeVariableFromGroupId = exports.addVariableToGroupId = exports.getContextToggleId = exports.getVariableInputId = exports.getApplyDefaultToLightScriptId = exports.getApplyContextToLightScriptId = exports.getTurnOffInfListenersPassthroughId = exports.getInfListerEntityIds = exports.getInfCurrContextOffListenerId = exports.getInfContextOffListenerId = exports.getInfContextOnListenerId = exports.getSupContextOnListenerScript = exports.getSupContextHandlerScriptId = exports.getDefaultHandlerScriptId = exports.getInfContextHandlerScriptId = exports.getInitializerScriptId = void 0;
const getInitializerScriptId = (light) => `init_${light.id}`;
exports.getInitializerScriptId = getInitializerScriptId;
// Context handler ids
const getInfContextHandlerScriptId = (light, context) => `inf_handler_${light.id}_${context.id}`;
exports.getInfContextHandlerScriptId = getInfContextHandlerScriptId;
const getDefaultHandlerScriptId = (light) => `inf_handler_${light.id}_default`;
exports.getDefaultHandlerScriptId = getDefaultHandlerScriptId;
const getSupContextHandlerScriptId = (light, context) => `sup_handler_${light.id}_${context.id}`;
exports.getSupContextHandlerScriptId = getSupContextHandlerScriptId;
// sup context listener ids
const getSupContextOnListenerScript = (light) => `listen_${light.id}_sup_context_on`;
exports.getSupContextOnListenerScript = getSupContextOnListenerScript;
// inf context listener ids
const getInfContextOnListenerId = (light) => `listen_${light.id}_inf_context_on`;
exports.getInfContextOnListenerId = getInfContextOnListenerId;
const getInfContextOffListenerId = (light) => `listen_${light.id}_inf_context_off`;
exports.getInfContextOffListenerId = getInfContextOffListenerId;
const getInfCurrContextOffListenerId = (light) => `listen_${light.id}_curr_context_off`;
exports.getInfCurrContextOffListenerId = getInfCurrContextOffListenerId;
const getInfListerEntityIds = (light) => [
    (0, exports.toScriptEntityId)((0, exports.getInfContextOnListenerId)(light)),
    (0, exports.toScriptEntityId)((0, exports.getInfContextOffListenerId)(light)),
    (0, exports.toScriptEntityId)((0, exports.getInfCurrContextOffListenerId)(light))
];
exports.getInfListerEntityIds = getInfListerEntityIds;
const getTurnOffInfListenersPassthroughId = (light) => `stop_inf_listen_passthrough_${light.id}`;
exports.getTurnOffInfListenersPassthroughId = getTurnOffInfListenersPassthroughId;
const getApplyContextToLightScriptId = (context, light) => `apply_${context.id}_${light.id}`;
exports.getApplyContextToLightScriptId = getApplyContextToLightScriptId;
const getApplyDefaultToLightScriptId = (light) => `apply_default_${light.id}`;
exports.getApplyDefaultToLightScriptId = getApplyDefaultToLightScriptId;
const getVariableInputId = (variable) => `var_${variable.namespace}_${variable.type}`;
exports.getVariableInputId = getVariableInputId;
const getContextToggleId = (context) => `context_${context.id}`;
exports.getContextToggleId = getContextToggleId;
exports.addVariableToGroupId = `add_variable_to_group`;
exports.removeVariableFromGroupId = `remove_variable_from_group`;
const getVarAttachScriptId = (light, context) => `attach_${light.id}_${context.id}`;
exports.getVarAttachScriptId = getVarAttachScriptId;
const getVarDetachScriptId = (light, context) => `detach_${light.id}_${context.id}`;
exports.getVarDetachScriptId = getVarDetachScriptId;
const getVariableGroupId = (variable) => `var_${variable.namespace}_group`;
exports.getVariableGroupId = getVariableGroupId;
const toInputNumberEntityId = (id) => `input_number.${id}`;
exports.toInputNumberEntityId = toInputNumberEntityId;
const toGroupEntityId = (id) => `group.${id}`;
exports.toGroupEntityId = toGroupEntityId;
const toScriptEntityId = (id) => `script.${id}`;
exports.toScriptEntityId = toScriptEntityId;
const toInputBooleanEntityId = (id) => `input_boolean.${id}`;
exports.toInputBooleanEntityId = toInputBooleanEntityId;
exports.ID_PREFIX = 'fsfr';
exports.ALIAS_PREFIX = 'FSFR::';

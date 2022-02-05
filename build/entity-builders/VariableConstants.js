"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIGHT_ID = exports.GROUP_ID = exports.persistentInfVariables = exports.APPLY_SCRIPT_ID = exports.DETACH_VARS_SCRIPT_ID = exports.SUP_CONTEXT_TOGGLE_ID = exports.INF_CONTEXT_TOGGLE_ID = exports.CURR_CONTEXT_TOGGLE_ID = exports.FIRST_INF_HANDLER_SCRIPT_ID = void 0;
exports.FIRST_INF_HANDLER_SCRIPT_ID = "first_inf_handler_script_id";
exports.CURR_CONTEXT_TOGGLE_ID = "curr_context_toggle_id";
exports.INF_CONTEXT_TOGGLE_ID = "inf_context_toggle_id";
exports.SUP_CONTEXT_TOGGLE_ID = "sup_context_toggle_id";
exports.DETACH_VARS_SCRIPT_ID = "detach_vars_script_id";
exports.APPLY_SCRIPT_ID = "apply_context_script_id";
exports.persistentInfVariables = {
    [exports.CURR_CONTEXT_TOGGLE_ID]: `{{ ${exports.CURR_CONTEXT_TOGGLE_ID} }}`,
    [exports.FIRST_INF_HANDLER_SCRIPT_ID]: `{{ ${exports.FIRST_INF_HANDLER_SCRIPT_ID} }}`,
    [exports.DETACH_VARS_SCRIPT_ID]: `{{ ${exports.DETACH_VARS_SCRIPT_ID} }}`
};
exports.GROUP_ID = 'group_id';
exports.LIGHT_ID = 'light_id';

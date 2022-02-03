export const FIRST_INF_HANDLER_SCRIPT_ID = "first_inf_handler_script_id"
export const CURR_CONTEXT_TOGGLE_ID = "curr_context_toggle_id"
export const INF_CONTEXT_TOGGLE_ID = "inf_context_toggle_id"
export const SUP_CONTEXT_TOGGLE_ID = "sup_context_toggle_id"

export const DETACH_VARS_SCRIPT_ID = "detach_vars_script_id"
export const APPLY_SCRIPT_ID = "apply_context_script_id"

export const persistentInfVariables = {
  [CURR_CONTEXT_TOGGLE_ID]: `{{ ${CURR_CONTEXT_TOGGLE_ID} }}`,
  [FIRST_INF_HANDLER_SCRIPT_ID]: `{{ ${FIRST_INF_HANDLER_SCRIPT_ID} }}`,
  [DETACH_VARS_SCRIPT_ID]: `{{ ${DETACH_VARS_SCRIPT_ID} }}`
}

export const GROUP_ID = 'group_id'
export const LIGHT_ID = 'light_id'
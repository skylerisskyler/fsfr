export const FIRST_INF_CONTEXT_SCRIPT = "first_inf_context_script"
export const CURR_CONTEXT_TOGGLE_ID = "curr_context_toggle_id"
export const INF_CONTEXT_TOGGLE_ID = "inf_context_toggle_id"
export const SUP_CONTEXT_TOGGLE_ID = "sup_context_toggle_id"
export const ATTACH_VARS_SCRIPT_ID = "attach_vars_curr_context_script_id"
export const DETACH_VARS_SCRIPT_ID = "detach_vars_curr_context_script_id"
export const APPLY_CONTEXT_SCRIPT_ID = "apply_context_script_id"

export const globalScriptVariables = {
  [CURR_CONTEXT_TOGGLE_ID]: `{{ ${CURR_CONTEXT_TOGGLE_ID} }}`,
  [FIRST_INF_CONTEXT_SCRIPT]: `{{ ${FIRST_INF_CONTEXT_SCRIPT} }}`,
  [DETACH_VARS_SCRIPT_ID]: `{{ ${DETACH_VARS_SCRIPT_ID} }}`,
  [ATTACH_VARS_SCRIPT_ID]: `{{ ${ATTACH_VARS_SCRIPT_ID} }}`
}

export const GROUP_ID = 'group_id'
export const LIGHT_ID = 'light_id'
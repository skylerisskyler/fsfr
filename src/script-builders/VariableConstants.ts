export const FIRST_INF_SCENE_SCRIPT = "first_inf_scene_script"
export const CURR_SCENE_TOGGLE_ID = "curr_scene_toggle_id"
export const INF_SCENE_TOGGLE_ID = "inf_scene_toggle_id"
export const SUP_SCENE_TOGGLE_ID = "sup_scene_toggle_id"
export const ATTACH_VARS_SCRIPT_ID = "attach_vars_curr_scene_script_id"
export const DETACH_VARS_SCRIPT_ID = "detach_vars_curr_scene_script_id"
export const APPLY_SCENE_SCRIPT_ID = "apply_scene_script_id"

export const globalScriptVariables = {
  [CURR_SCENE_TOGGLE_ID]: `{{ ${CURR_SCENE_TOGGLE_ID} }}`,
  [FIRST_INF_SCENE_SCRIPT]: `{{ ${FIRST_INF_SCENE_SCRIPT} }}`,
  [DETACH_VARS_SCRIPT_ID]: `{{ ${DETACH_VARS_SCRIPT_ID} }}`,
  [ATTACH_VARS_SCRIPT_ID]: `{{ ${ATTACH_VARS_SCRIPT_ID} }}`
}

export const GROUP_ID = 'group_id'
export const LIGHT_ID = 'light_id'
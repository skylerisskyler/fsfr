export const FIRST_INF_SCENE_SCRIPT = "first_inf_scene_script"
export const CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE = "current_scene_toggle_id"
export const INF_SCENE_TOGGLE_ID_VAR_NAMESPACE = "inf_scene_toggle_id"
export const SUP_SCENE_TOGGLE_ID_VAR_NAMESPACE = "sup_scene_toggle_id"
export const ATTACH_VARS_IN_SCENE_ID = "attach_vars_in_scene_id"
export const DETACH_VARS_IN_SCENE_ID = "detach_vars_in_scene_id"
export const NAMESPACE_FOR_APPLY_SCENE_SCRIPT_VAR = "namespace_for_apply_scene_var"

export const infSceneLoopVariables = {
  [CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE]: `{{ ${CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE} }}`,
  [FIRST_INF_SCENE_SCRIPT]: `{{ ${FIRST_INF_SCENE_SCRIPT} }}`
}
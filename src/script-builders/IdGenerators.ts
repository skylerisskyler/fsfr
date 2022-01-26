import { Light } from '../fsfr-types/Light'
import { Scene } from '../fsfr-types/Scene'


// Scene handler ids
export const getInfSceneHandlerScriptId = (light: Light, scene: Scene) => `handle_inf_${light.id}_${scene.id}`
export const getSupSceneHandlerScriptId = (light: Light, scene: Scene) => `handle_sup_${light.id}_${scene.id}`

// scene listener ids
export const getSupSceneOnListenerScript = (light: Light) => `${light.id}_sup_scene_listener`
export const getInfSceneOnListenerId = (light: Light) => `${light.id}_inf_scene_on_listener`
export const getInfSceneOffListenerId = (light: Light) => `${light.id}_inf_scene__off_listener`
export const getInfCurrSceneOffListenerId = (light: Light) => `${light.id}_curr_scene__off_listener`

export const getApplySceneToLightScriptId = (scene: Scene, light: Light) => `apply_scene_${scene.id}_to_light_${light.id}`

export const getDefaultId = (light: Light) => `default_layer_${light.id}`

export const getTurnOffInfListenersPassthroughId = (light: Light)  => `passthrough_${light.id}`

export const getVarAttachScriptId = (light: Light, scene: Scene) => `ATTACH LIGHT TO VARIABLES IN layer`
export const getVarDetachScriptId = (light: Light, scene: Scene) => `DETACH LIGHT FROM VARIABLES IN Layer`


export const toScriptEntityId = (id: string) => `script.${id}`
export const toInputBooleanEntityId = (id: string) => `input_boolean.${id}`
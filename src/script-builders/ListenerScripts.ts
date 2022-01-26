import { Script } from '../ha-config-types/Script'
import { getInfSceneOffListenerId, getInfSceneOnListenerId, getSupSceneOnListenerScript, getTurnOffInfListenersPassthroughId, toScriptEntityId } from './IdGenerators'
import {Light} from '../fsfr-types/Light'
import { CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE, FIRST_INF_SCENE_SCRIPT, INF_SCENE_TOGGLE_ID_VAR_NAMESPACE, NAMESPACE_FOR_APPLY_SCENE_VAR } from './VariableConstants'


export function createListenInfSceneOnScript(light: Light) { // blue

  const script: Script = new Script({
    id: getInfSceneOnListenerId(light),
    alias: 'SCRIPT: Listen for inf scene on'
  })
  .addAction({
    wait_template: `{{ is_state(${INF_SCENE_TOGGLE_ID_VAR_NAMESPACE}, 'on') }}`
  })
  .addAction({
    service: 'script.turn_on',
    target: {entity_id: toScriptEntityId(getTurnOffInfListenersPassthroughId(light))},
    data: {
      variables: {
        [FIRST_INF_SCENE_SCRIPT]: FIRST_INF_SCENE_SCRIPT,
        [CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE]: `{{ ${CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE} }}`,
        callback: `{{ ${NAMESPACE_FOR_APPLY_SCENE_VAR} }}`
      }
    }
  })

  return script
}


export function createListenInfSceneOffScript(light: Light) { // purple

  const script: Script = new Script({
    id: getInfSceneOffListenerId(light),
    alias: 'some alias',
    mode: 'parallel'
  })
  .addAction({
    wait_template: "{{ is_state(scene_toggle_id, 'off') }}"
  })
  .addAction({
    service: 'script.turn_on',
    target: {entity_id: toScriptEntityId(getTurnOffInfListenersPassthroughId(light))},
    data: {
      variables: {
        [FIRST_INF_SCENE_SCRIPT]: FIRST_INF_SCENE_SCRIPT,
        [CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE]: `{{ ${CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE} }}`
      }
    }
  })

  return script
}



export function createSuperiorSceneOnListener(light: Light) {

  const superiorSceneListener: Script = new Script({
    id: getSupSceneOnListenerScript(light),
    alias: 'some alias'
  })
  .addAction({
    wait_template: "{{ is_state(scene_toggle_id, 'on') }}"
  })
  .addAction({
    service: 'script.turn_on',
    target: {entity_id: `script.apply_scene_to_light`},
    data: {
      variables: {}
    }
  })

  return superiorSceneListener
}

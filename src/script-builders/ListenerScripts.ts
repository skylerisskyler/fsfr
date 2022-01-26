import { Script } from '../ha-config-types/Script'
import { getApplySceneToLightScriptId, getInfCurrSceneOffListenerId, getInfSceneOffListenerId, getInfSceneOnListenerId, getSupSceneOnListenerScript, getTurnOffInfListenersPassthroughId, toScriptEntityId } from './IdGenerators'
import {Light} from '../fsfr-types/Light'
import { NAMESPACE_FOR_APPLY_SCENE_SCRIPT_VAR, CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE, FIRST_INF_SCENE_SCRIPT, INF_SCENE_TOGGLE_ID_VAR_NAMESPACE, , SUP_SCENE_TOGGLE_ID_VAR_NAMESPACE } from './VariableConstants'



export function createSuperiorSceneOnListener(light: Light) { //green

  const superiorSceneListener: Script = new Script({
    id: getSupSceneOnListenerScript(light),
    alias: `SCRIPT: Listen superior scene on for ${light.id}`,
  })
  .addAction({
    alias: `ACTION: Wait for superior scene of ${light.id} to be on`,
    wait_template: `{{ is_state(${NAMESPACE_FOR_APPLY_SCENE_SCRIPT_VAR}, 'on') }}`
  })
  .addAction({
    alias: `ACTION: apply scene to light script`,
    service: 'script.turn_on',
    target: {entity_id: toScriptEntityId(getTurnOffInfListenersPassthroughId(light))},
    data: {
      variables: {
        //passthrough
        [FIRST_INF_SCENE_SCRIPT]: undefined,
        [CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE]: undefined,
        //important
        callback: `{{ ${NAMESPACE_FOR_APPLY_SCENE_SCRIPT_VAR} }}`,
        [NAMESPACE_FOR_APPLY_SCENE_SCRIPT_VAR]: `{{ ${NAMESPACE_FOR_APPLY_SCENE_SCRIPT_VAR} }}`,
      }
    }
  })

  return superiorSceneListener
}

export function createListenCurrSceneOffScript(light: Light) { //yellow
  const currSceneOffListener: Script = new Script({
    id: getInfCurrSceneOffListenerId(light),
    alias: 'some alias'
  })
  .addAction({
    alias: `ACTION: Wait for current scene to be off`,
    wait_template: `{{ is_state(${CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE}, 'off') }}`
  })
  .addAction({
    service: 'script.turn_on',
    target: { entity_id: toScriptEntityId(getTurnOffInfListenersPassthroughId(light)) },
    data: {
      variables: {
        
      }
    }
  })

  return currSceneOffListener
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
        callback: `{{ ${FIRST_INF_SCENE_SCRIPT} }}`
      }
    }
  })

  return script
}


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





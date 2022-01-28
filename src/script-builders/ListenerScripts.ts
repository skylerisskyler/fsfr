import { Script } from '../ha-config-types/Script'
import { getApplySceneToLightScriptId, getInfCurrSceneOffListenerId, getInfSceneOffListenerId, getInfSceneOnListenerId, getSupSceneOnListenerScript, getTurnOffInfListenersPassthroughId, toScriptEntityId } from './IdGenerators'
import {Light} from '../fsfr-types/Light'
import { FIRST_INF_SCENE_SCRIPT, globalScriptVariables, APPLY_SCENE_SCRIPT_ID, SUP_SCENE_TOGGLE_ID, CURR_SCENE_TOGGLE_ID, INF_SCENE_TOGGLE_ID } from './VariableConstants'



export function createSuperiorSceneOnListener(light: Light) { //green

  const superiorSceneListener: Script = new Script({
    id: getSupSceneOnListenerScript(light),
    alias: `SCRIPT: Listen superior scene on for ${light.id}`,
  })
  .addAction({
    alias: `ACTION: Wait for superior scene of ${light.id} to be on`,
    wait_template: `{{ is_state(${SUP_SCENE_TOGGLE_ID}, 'on') }}`
  })
  .addAction({
    alias: `ACTION: apply scene to light script`,
    service: 'script.turn_on',
    target: {entity_id: toScriptEntityId(getTurnOffInfListenersPassthroughId(light))},
    data: {
      variables: {
        ...globalScriptVariables,
        callback: `{{ callback }}`,
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
    wait_template: `{{ is_state(${CURR_SCENE_TOGGLE_ID}, 'off') }}`
  })
  .addAction({
    service: 'script.turn_on',
    target: { entity_id: toScriptEntityId(getTurnOffInfListenersPassthroughId(light)) },
    data: {
      variables: {
        ...globalScriptVariables,
        callback: `{{ callback }}`,
      }
    }
  })

  return currSceneOffListener
}

export function createListenInfSceneOffScript(light: Light) { // purple

  const script: Script = new Script({
    id: getInfSceneOffListenerId(light),
    alias: 'SCRIPT: Listen inferior scene off',
    mode: 'parallel'
  })
  .addAction({
    alias: 'ACTION: Wait for inferior scene to be off',
    wait_template: `{{ is_state(${INF_SCENE_TOGGLE_ID}, 'off') }}`
  })
  .addAction({
    alias: 'ACTION: Call passthrough script',
    service: 'script.turn_on',
    target: {entity_id: toScriptEntityId(getTurnOffInfListenersPassthroughId(light))},
    data: {
      variables: {
        ...globalScriptVariables,
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
    alias: 'ACTION: Wait for inf scene to be on',
    wait_template: `{{ is_state(${INF_SCENE_TOGGLE_ID}, 'on') }}`
  })
  .addAction({
    alias: 'ACTION: Call passthrough script',
    service: 'script.turn_on',
    target: {entity_id: toScriptEntityId(getTurnOffInfListenersPassthroughId(light))},
    data: {
      variables: {
        ...globalScriptVariables,
        callback: `{{ ${FIRST_INF_SCENE_SCRIPT} }}`
      }
    }
  })

  return script
}





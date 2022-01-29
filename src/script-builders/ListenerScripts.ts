import { Script } from '../ha-config-types/Script'
import { getApplyContextToLightScriptId, getInfCurrContextOffListenerId, getInfContextOffListenerId, getInfContextOnListenerId, getSupContextOnListenerScript, getTurnOffInfListenersPassthroughId, toScriptEntityId } from './IdGenerators'
import {Light} from '../fsfr-types/Light'
import { FIRST_INF_CONTEXT_SCRIPT, globalScriptVariables, APPLY_CONTEXT_SCRIPT_ID, SUP_CONTEXT_TOGGLE_ID, CURR_CONTEXT_TOGGLE_ID, INF_CONTEXT_TOGGLE_ID } from './VariableConstants'



export function createSuperiorContextOnListener(light: Light) { //green

  const superiorContextListener: Script = new Script({
    id: getSupContextOnListenerScript(light),
    alias: `SCRIPT: Listen superior context on for ${light.id}`,
  })
  .addAction({
    alias: `ACTION: Wait for superior context of ${light.id} to be on`,
    wait_template: `{{ is_state(${SUP_CONTEXT_TOGGLE_ID}, 'on') }}`
  })
  .addAction({
    alias: `ACTION: apply context to light script`,
    service: 'script.turn_on',
    target: {entity_id: toScriptEntityId(getTurnOffInfListenersPassthroughId(light))},
    data: {
      variables: {
        ...globalScriptVariables,
        callback: `{{ callback }}`,
      }
    }
  })

  return superiorContextListener
}

export function createListenCurrContextOffScript(light: Light) { //yellow
  const currContextOffListener: Script = new Script({
    id: getInfCurrContextOffListenerId(light),
    alias: 'some alias'
  })
  .addAction({
    alias: `ACTION: Wait for current context to be off`,
    wait_template: `{{ is_state(${CURR_CONTEXT_TOGGLE_ID}, 'off') }}`
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

  return currContextOffListener
}

export function createListenInfContextOffScript(light: Light) { // purple

  const script: Script = new Script({
    id: getInfContextOffListenerId(light),
    alias: 'SCRIPT: Listen inferior context off',
    mode: 'parallel'
  })
  .addAction({
    alias: 'ACTION: Wait for inferior context to be off',
    wait_template: `{{ is_state(${INF_CONTEXT_TOGGLE_ID}, 'off') }}`
  })
  .addAction({
    alias: 'ACTION: Call passthrough script',
    service: 'script.turn_on',
    target: {entity_id: toScriptEntityId(getTurnOffInfListenersPassthroughId(light))},
    data: {
      variables: {
        ...globalScriptVariables,
        callback: `{{ ${FIRST_INF_CONTEXT_SCRIPT} }}`
      }
    }
  })

  return script
}


export function createListenInfContextOnScript(light: Light) { // blue

  const script: Script = new Script({
    id: getInfContextOnListenerId(light),
    alias: 'SCRIPT: Listen for inf context on'
  })
  .addAction({
    alias: 'ACTION: Wait for inf context to be on',
    wait_template: `{{ is_state(${INF_CONTEXT_TOGGLE_ID}, 'on') }}`
  })
  .addAction({
    alias: 'ACTION: Call passthrough script',
    service: 'script.turn_on',
    target: {entity_id: toScriptEntityId(getTurnOffInfListenersPassthroughId(light))},
    data: {
      variables: {
        ...globalScriptVariables,
        callback: `{{ ${FIRST_INF_CONTEXT_SCRIPT} }}`
      }
    }
  })

  return script
}





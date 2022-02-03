import { Script } from '../ha-config-types/Script'
import { getApplyContextToLightScriptId, getInfCurrContextOffListenerId, getInfContextOffListenerId, getInfContextOnListenerId, getSupContextOnListenerScript, toScriptEntityId, getTurnOffInfListenersPassthroughId } from './IdGenerators'
import {Light} from '../fsfr-types/Light'
import { FIRST_INF_HANDLER_SCRIPT_ID, persistentInfVariables, APPLY_SCRIPT_ID, SUP_CONTEXT_TOGGLE_ID, CURR_CONTEXT_TOGGLE_ID, INF_CONTEXT_TOGGLE_ID, DETACH_VARS_SCRIPT_ID } from './VariableConstants'
import { createInfListenerOffAction } from './InfListenerOffAction'



export function createSuperiorContextOnListener(light: Light) {

  const superiorContextListener: Script = new Script({
    id: getSupContextOnListenerScript(light),
    alias: `SCRIPT: Listen superior context on for ${light.id}`,
    mode: 'parallel' //TODO: require all scripts have mode defined
  })
  .addAction({
    alias: `ACTION: Wait for superior context of ${light.id} to be on`,
    wait_template: `{{ is_state(${SUP_CONTEXT_TOGGLE_ID}, 'on') }}`
  })
  .addAction({
    alias: `ACTION: Call apply superior context to ${light.id} script`,
    service: 'script.turn_on',
    target: { entity_id: `{{ ${APPLY_SCRIPT_ID} }}`},
    data: {
      variables: {
        [DETACH_VARS_SCRIPT_ID]: `{{ ${DETACH_VARS_SCRIPT_ID} }}`
      }
    }
  })

  return superiorContextListener.compile()
}

export function createListenCurrContextOffScript(light: Light) {
  const currContextOffListener: Script = new Script({
    id: getInfCurrContextOffListenerId(light),
    alias: `SCRIPT: Listen current context off for ${light.id}`,
    mode: 'parallel' //TODO: require all scripts have mode defined
  })
  .addAction({
    alias: `ACTION: Wait for current context to be off`,
    wait_template: `{{ is_state(${CURR_CONTEXT_TOGGLE_ID}, 'off') }}`
  })
  .addAction({
    alias: `ACTION: Call apply superior context to ${light.id} script`,
    service: 'script.turn_on',
    target: { entity_id: `{{ ${APPLY_SCRIPT_ID} }}`},
    data: {
      variables: {
        [DETACH_VARS_SCRIPT_ID]: `{{ ${DETACH_VARS_SCRIPT_ID} }}`,
      }
    }
  })

  return currContextOffListener.compile()
}

export function createListenInfContextOffScript(light: Light) {

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
        ...persistentInfVariables
      }
    }
  })

  return script.compile()
}


export function createListenInfContextOnScript(light: Light) {

  const script: Script = new Script({
    id: getInfContextOnListenerId(light),
    alias: 'SCRIPT: Listen for inf context on',
    mode: 'parallel'
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
        ...persistentInfVariables
      }
    }
  })


  return script.compile()
}





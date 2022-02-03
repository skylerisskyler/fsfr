import { Layer } from '../fsfr-types/Layer'
import { Light } from '../fsfr-types/Light'
import { ChooseAction, ChooseActionChoice } from '../ha-config-types/Action'
import { Script, ScriptProps } from '../ha-config-types/Script'
import { getApplyContextToLightScriptId, getInfCurrContextOffListenerId, getInfContextHandlerScriptId, getInfContextOffListenerId, getInfContextOnListenerId, getContextToggleId, getSupContextHandlerScriptId, getSupContextOnListenerScript, toInputBooleanEntityId, toScriptEntityId, getApplyDefaultToLightScriptId, getDefaultHandlerScriptId } from './IdGenerators'
import { APPLY_SCRIPT_ID, CURR_CONTEXT_TOGGLE_ID, DETACH_VARS_SCRIPT_ID, FIRST_INF_HANDLER_SCRIPT_ID, persistentInfVariables, INF_CONTEXT_TOGGLE_ID, SUP_CONTEXT_TOGGLE_ID } from './VariableConstants'



export function createSupHandlerScripts(light: Light): ScriptProps[] {

  const scripts: Script[] =  light.layers
    .reverse()
    .map((layer, idx, layers) => {

      const { context } = layer

      const script: Script = new Script({
        id: getSupContextHandlerScriptId(light, context),
        alias: `SCRIPT: Superior context handler ${context.id}`
      })
      .addAction({
        alias: `ACTION: turn on ${context.id} on listener`,
        service: 'script.turn_on',
        target: {entity_id: toScriptEntityId(getSupContextOnListenerScript(light))},
        data: {
          variables: {
            [DETACH_VARS_SCRIPT_ID]: `{{ ${DETACH_VARS_SCRIPT_ID} }}`,
            [SUP_CONTEXT_TOGGLE_ID]: toInputBooleanEntityId(getContextToggleId(context)),
            [APPLY_SCRIPT_ID]: toScriptEntityId(getApplyContextToLightScriptId(context, light))
          }
        }
      })

      const nextLayer: Layer | undefined = layers[idx + 1]
      if(nextLayer) {
        script.addAction({
          alias: `ACTION: turn on next context ${nextLayer.context.id} handler`,
          service: 'script.turn_on',
          target: {entity_id: toScriptEntityId(getSupContextHandlerScriptId(light, nextLayer.context))},
          data: {
            variables: {
              [DETACH_VARS_SCRIPT_ID]: `{{ ${DETACH_VARS_SCRIPT_ID} }}`
            }
          }
        })
      }

      return script.compile()
    })

  return scripts
}

export function createInfHandlerScripts(light: Light) {

  const scripts: Script[] =  light.layers
    .slice(1)
    .map((layer, idx, layers) => {

      const { context } = layer

      const script: Script = new Script({
        id: getInfContextHandlerScriptId(light, context),
        alias: `SCRIPT: Handle inferior context ${context.id} for ${light.id}`,
      })

      const onChoice = new ChooseActionChoice(`if ${context.id} is on`)
        .addCondition({
          alias: `CONDITION: check ${context.id} toggle is on`,
          condition: 'state',
          entity_id: toInputBooleanEntityId(getContextToggleId(context)),
          state: 'on'
        })
        .addAction({
          alias: `ACTION: Initialize current context off listener`,
          service: 'script.turn_on',
          target: {entity_id: toScriptEntityId(getInfCurrContextOffListenerId(light))}, //yellow
          data: {
            variables: {
              [DETACH_VARS_SCRIPT_ID]: `{{ ${DETACH_VARS_SCRIPT_ID} }}`,
              [CURR_CONTEXT_TOGGLE_ID]: `{{ ${CURR_CONTEXT_TOGGLE_ID} }}`,
              [APPLY_SCRIPT_ID]: toScriptEntityId(getApplyContextToLightScriptId(context, light))
            }
          }
        })
        .addAction({
          alias: `ACTION: Initialize ${context.id} context off listener`,
          service: 'script.turn_on',
          target: {
            entity_id: toScriptEntityId(getInfContextOffListenerId(light))
          },
          data: {
            variables: {
              ...persistentInfVariables,
              [DETACH_VARS_SCRIPT_ID]: `{{ ${DETACH_VARS_SCRIPT_ID} }}`,
              [INF_CONTEXT_TOGGLE_ID]: toScriptEntityId(getContextToggleId(context))
            }
          }
        })

      const offChoice = new ChooseActionChoice(`if ${context.id} is off`)
      .addCondition({
        alias: `CONDITION: check ${context.id} is off`,
        condition: 'state',
        entity_id: toInputBooleanEntityId(getContextToggleId(context)),
        state: 'off'
      })
      .addAction({
        alias: `ACTION: Initialize ${context.id} context on listener`,
        service: 'script.turn_on',
        target: {entity_id: toScriptEntityId(getInfContextOnListenerId(light)) }, //blue
        data: {
          variables: {
            ...persistentInfVariables,
            [INF_CONTEXT_TOGGLE_ID]: toInputBooleanEntityId(getContextToggleId(context))
          }
        }
      })

    const nextLayer: Layer | undefined = layers[idx + 1]

    if(nextLayer) {

      offChoice.addAction({
        alias: `ACTION: turn on next context ${nextLayer.context.id} handler`,
        service: 'script.turn_on',
        target: {entity_id: toScriptEntityId(getInfContextHandlerScriptId(light, nextLayer.context))},
        data: {
          variables: {
            ...persistentInfVariables
          }
        }
      })
    } else {
      offChoice.addAction({
        alias: `ACTION: Turn on default layer of none other exists`,
        service: 'script.turn_on',
        target: {entity_id: toScriptEntityId(getApplyDefaultToLightScriptId(light))},
      })
    }

    script
      .addAction(
        new ChooseAction('Is inferior context on or off?')
        .addChoice(onChoice)
        .addChoice(offChoice)
      )

    return script.compile()
  })

  const defaultScript: Script = new Script({
    alias: `SCRIPT: default`,
    id: getDefaultHandlerScriptId(light),
  })

  if(!light.default) { //TODO: define default behave in config
    defaultScript
      .addAction({
        alias: `ACTION: initialize current context off listener`,
        service: 'script.turn_on',
        target: {entity_id: toScriptEntityId(getInfCurrContextOffListenerId(light))}, //yellow
        data: {
          variables: {
            ...persistentInfVariables,
            [APPLY_SCRIPT_ID]: toScriptEntityId(getApplyDefaultToLightScriptId(light))
          }
        }
      })
  }
    
  scripts.push(defaultScript.compile())

  return scripts
}


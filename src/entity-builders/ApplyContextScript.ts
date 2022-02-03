import { Layer } from "../fsfr-types/Layer"
import { Light } from "../fsfr-types/Light"
import { Action, ChooseAction, ChooseActionChoice } from "../ha-config-types/Action"
import { Script, ScriptProps } from "../ha-config-types/Script"
import {
  getApplyContextToLightScriptId,
  getInfContextHandlerScriptId,
  getContextToggleId,
  getSupContextHandlerScriptId,
  getSupContextOnListenerScript,
  getVarAttachScriptId,
  getVarDetachScriptId,
  toInputBooleanEntityId,
  toScriptEntityId,
  getApplyDefaultToLightScriptId,
  getDefaultHandlerScriptId,
  getInfListerEntityIds,
} from "./IdGenerators"
import {
  CURR_CONTEXT_TOGGLE_ID,
  DETACH_VARS_SCRIPT_ID,
  FIRST_INF_HANDLER_SCRIPT_ID,
  persistentInfVariables
} from "./VariableConstants"

const createIfVariableExistsAction = (light: Light): Action => {
  return new ChooseAction(`Check variables to detach for ${light.id}`)
    .addChoice(
      new ChooseActionChoice("ACTION: Check detach script ID exists")
        .addCondition({
          condition: 'template',
          value_template: `{{ ${DETACH_VARS_SCRIPT_ID} is not false }}`
        })
        .addAction({
          alias: `ACTION: Detach variables of ${light.id} in current scene`,
          service: `{{ ${DETACH_VARS_SCRIPT_ID} }}`,
        })
  )
}

const createTurnOffAllListersAction = (light: Light): Action => {
  return {
    alias: "ACTION: Turn off superior context on listener",
    service: "script.turn_off",
    target: {
      entity_id: [
        ...getInfListerEntityIds(light),
        toScriptEntityId(getSupContextOnListenerScript(light))
      ]
    }
  }
}

export function applyContextToLightScripts(light: Light): ScriptProps[] {
  console.log(light.layers)
  const scripts = light.layers.map((layer, idx, layers) => {

    const { context } = layer

    const script: Script = new Script({
      id: getApplyContextToLightScriptId(context, light),
      alias: `SCRIPT: Apply context ${context.id} to light`
    })
    .addAction(createTurnOffAllListersAction(light))
    .addAction(createIfVariableExistsAction(light))

    if(layer.style.variables.length > 0) {
      script.addAction({
        alias: `ACTION: Attach variables of ${light.id} in ${context.id}`,
        service: toScriptEntityId(getVarAttachScriptId(light, context)),
      })
    }

    script.addAction({
      alias: `ACTION: turn on light ${light.id} with styles of ${context.id}`,
      service: "light.turn_on",
      target: {entity_id: light.entityId},
      data: layer.style.data
    })

    let detachVarsValue = {}
    if(layer.style.variables.length > 0) {
      detachVarsValue = {
        [DETACH_VARS_SCRIPT_ID]: toScriptEntityId(getVarDetachScriptId(light, context)),
      }
    } else {
      detachVarsValue = {
        [DETACH_VARS_SCRIPT_ID]: false,
      }
    }

    const firstSuperiorLayer: Layer | undefined = layers[idx - 1]

    if(firstSuperiorLayer) {
      script.addAction({
        alias: "ACTION: Turn on the first superior context handler",
        service: "script.turn_on",
        target: {entity_id: toScriptEntityId(getSupContextHandlerScriptId(light, firstSuperiorLayer.context))},
        data: {
          variables: {
            ...detachVarsValue
          }
        }
      })
    }



    const firstInferiorLayer: Layer | undefined = layers[idx + 1]

    if(firstInferiorLayer) {

      script.addAction({
        alias: `ACTION: Turn on the first inferior context handler`,
        service: "script.turn_on",
        target: {entity_id: toScriptEntityId(getInfContextHandlerScriptId(light, firstInferiorLayer.context))},
        data: {
          variables: {
            [CURR_CONTEXT_TOGGLE_ID]: toInputBooleanEntityId(getContextToggleId(context)),
            [FIRST_INF_HANDLER_SCRIPT_ID]: toScriptEntityId(getInfContextHandlerScriptId(light, context)),
            ...detachVarsValue
          }
        }
      })
    } else {
      script.addAction({
        alias: `ACTION: Turn on handle default`,
        service: "script.turn_on",
        target: {entity_id: toScriptEntityId(getDefaultHandlerScriptId(light))},
        data: {
          variables: {
            [CURR_CONTEXT_TOGGLE_ID]: toInputBooleanEntityId(getContextToggleId(context)),
            [FIRST_INF_HANDLER_SCRIPT_ID]: toScriptEntityId(getInfContextHandlerScriptId(light, context)),
            ...detachVarsValue
          }
        }
      })

    }

    return script.compile()
  })

  const applyDefault = new Script({
    id: getApplyDefaultToLightScriptId(light),
    alias: "SCRIPT: Apply default context to light"
  })
  .addAction(createTurnOffAllListersAction(light))
  .addAction(createIfVariableExistsAction(light))
  .addAction({
    alias: `ACTION: Default turn off ${light.id}`,
    service: "light.turn_on",
    target: {entity_id: light.entityId},
    data: {
      color_name: 'white', //TODO: Decide on a default color
      brightness: 0
    }
  })
  // console.log(light.layers)
  const firstSuperiorLayer: Layer | undefined = light.layers[light.layers.length - 1]
  console.log(firstSuperiorLayer)
  if(firstSuperiorLayer) {
    applyDefault.addAction({
      alias: "ACTION: Turn on the first superior context handler",
      service: "script.turn_on",
      target: {entity_id: toScriptEntityId(getSupContextHandlerScriptId(light, firstSuperiorLayer.context))},
      data: {
        variables: {
          [DETACH_VARS_SCRIPT_ID]: false
        }
      }
    })
  }

  scripts.push(applyDefault.compile())

  return scripts
}
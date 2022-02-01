import { Layer } from "../fsfr-types/Layer"
import { Light } from "../fsfr-types/Light"
import { ChooseAction, ChooseActionChoice } from "../ha-config-types/Action"
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
  getDefaultHandlerScriptId
} from "./IdGenerators"
import {
  APPLY_CONTEXT_SCRIPT_ID,
  ATTACH_VARS_SCRIPT_ID,
  CURR_CONTEXT_TOGGLE_ID,
  DETACH_VARS_SCRIPT_ID,
  FIRST_INF_CONTEXT_SCRIPT,
  globalScriptVariables
} from "./VariableConstants"

export function applyContextToLightScripts(light: Light): ScriptProps[] {
  const scripts = light.layers.map((layer, idx, layers) => {

    const { context } = layer

    const script: Script = new Script({
      id: getApplyContextToLightScriptId(context, light),
      alias: `SCRIPT: Apply context ${context.id} to light`
    })
    //TODO: handle if there is no superior layer
    .addAction({
      alias: "ACTION: Turn off superior context on listener",
      service: "script.turn_off",
      target: {
        entity_id: toScriptEntityId(getSupContextOnListenerScript(light))
      }
    })
    .addAction(
      new ChooseAction(`Choose action for ${light.id}`)
        .addChoice(
          new ChooseActionChoice("ACTION: Turn on light")
            .addCondition({
              condition: 'template',
              value_template: `{{ ${DETACH_VARS_SCRIPT_ID} is not false }}`
            })
            .addAction({
              alias: `ACTION: Detach variables of ${light.id} in current scene`,
              service: `{{ ${DETACH_VARS_SCRIPT_ID} }}`,
            })
        )
    )
    .addAction({
      alias: `ACTION: Attach variables of ${light.id} in ${context.id}`,
      service: toScriptEntityId(getVarAttachScriptId(light, context)),
    })
    .addAction({
      alias: `ACTION: turn on light ${light.id} with data of ${context.id}`,
      service: "light.turn_on",
      target: {entity_id: light.entityId},
      data: layer.style.data
    })

    const firstSuperiorLayer: Layer | undefined = layers[idx +1]

    if(firstSuperiorLayer) {
      script.addAction({
        alias: "ACTION: Turn on the first superior context handler",
        service: "script.turn_on",
        target: {entity_id: toScriptEntityId(getSupContextHandlerScriptId(light, firstSuperiorLayer.context))},
        data: {
          variables: {
            ...globalScriptVariables,
            [CURR_CONTEXT_TOGGLE_ID]: toInputBooleanEntityId(getContextToggleId(context)),
            [FIRST_INF_CONTEXT_SCRIPT]: toScriptEntityId(getInfContextHandlerScriptId(light, context)),
            [ATTACH_VARS_SCRIPT_ID]: toScriptEntityId(getVarAttachScriptId(light, context)),
            [DETACH_VARS_SCRIPT_ID]: toScriptEntityId(getVarDetachScriptId(light, context)),
          }
        }
      })
    }

    const firstInferiorLayer: Layer | undefined = layers[idx - 1]

    if(firstInferiorLayer) {
      script.addAction({
        alias: `ACTION: Turn on the first inferior context handler`,
        service: "script.turn_on",
        target: {entity_id: toScriptEntityId(getInfContextHandlerScriptId(light, firstInferiorLayer.context))},
        data: {
          variables: {
            ...globalScriptVariables,
          }
        }
      })
    } else {
      script.addAction({
        alias: `ACTION: Turn on the first inferior context handler`,
        service: "script.turn_on",
        target: {entity_id: toScriptEntityId(getDefaultHandlerScriptId(light))},
        data: {
          variables: {
            ...globalScriptVariables,
            [CURR_CONTEXT_TOGGLE_ID]: toInputBooleanEntityId(getContextToggleId(context)),
            [FIRST_INF_CONTEXT_SCRIPT]: toScriptEntityId(getInfContextHandlerScriptId(light, context)),
            [ATTACH_VARS_SCRIPT_ID]: toScriptEntityId(getVarAttachScriptId(light, context)),
            [DETACH_VARS_SCRIPT_ID]: toScriptEntityId(getVarDetachScriptId(light, context))
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
  .addAction({
    alias: "ACTION: Turn off superior context on listener",
    service: "script.turn_off",
    target: {
      entity_id: toScriptEntityId(getSupContextOnListenerScript(light))
    }
  })
  // .addAction({
  //   alias: "ACTION: Turn off superior context on listener",
  //   service: "notify.persistent_notification",
  //   data: {
  //     message: `{{ ${DETACH_VARS_SCRIPT_ID} }}`
  //   }
  // })
  .addAction(
    new ChooseAction(`Choose action for ${light.id}`)
      .addChoice(
        new ChooseActionChoice("ACTION: Turn on light")
          .addCondition({
            condition: 'template',
            value_template: `{{ ${DETACH_VARS_SCRIPT_ID} is not false }}`
          })
          .addAction({
            alias: `ACTION: Detach variables of ${light.id} in current scene`,
            service: `{{ ${DETACH_VARS_SCRIPT_ID} }}`,
          })
      )
  )
  .addAction({
    alias: `ACTION: Default turn off ${light.id}`,
    service: "light.turn_on",
    target: {entity_id: light.entityId},
    data: {
      color_name: 'white', //TODO: Decide on a default color
      brightness: 0
    }
  })
  const firstSuperiorLayer: Layer | undefined = light.layers[light.layers.length - 1]

  if(firstSuperiorLayer) {
    applyDefault.addAction({
      alias: "ACTION: Turn on the first superior context handler",
      service: "script.turn_on",
      target: {entity_id: toScriptEntityId(getSupContextHandlerScriptId(light, firstSuperiorLayer.context))},
      data: {
        variables: { //TODO: Decide on a how to handle variables
          ...globalScriptVariables,
        }
      }
    })
  }

  scripts.push(applyDefault.compile())

  return scripts
}
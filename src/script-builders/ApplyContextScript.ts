import { Layer } from "../fsfr-types/Layer"
import { Light } from "../fsfr-types/Light"
import { Script } from "../ha-config-types/Script"
import { getApplyContextToLightScriptId, getInfContextHandlerScriptId, getContextToggleId, getSupContextHandlerScriptId, getSupContextOnListenerScript, getVarAttachScriptId, getVarDetachScriptId, toInputBooleanEntityId, toScriptEntityId } from "./IdGenerators"
import {  APPLY_CONTEXT_SCRIPT_ID, ATTACH_VARS_SCRIPT_ID, CURR_CONTEXT_TOGGLE_ID, DETACH_VARS_SCRIPT_ID,  FIRST_INF_CONTEXT_SCRIPT, globalScriptVariables } from "./VariableConstants"

export function applyContextToLightScripts(light: Light) {
  return light.layers.map((layer, idx, layers) => {

    const { context } = layer

    const script: Script = new Script({
      id: getApplyContextToLightScriptId(context, light),
      alias: `SCRIPT: Apply context ${context.id} to light`
    })
    .addAction({
      alias: "ACTION: Turn off superior context on listener",
      service: "script.turn_off",
      target: {
        entity_id: toScriptEntityId(getSupContextOnListenerScript(light))
      }
    })
    .addAction({
      alias: `ACTION: Detach variables of ${light.id} in ${context.id}`,
      service: `{{ ${DETACH_VARS_SCRIPT_ID} }}`,
    })
    .addAction({
      alias: `ACTION: Attach variables of ${light.id} in ${context.id}`,
      service: `{{ ${ATTACH_VARS_SCRIPT_ID} }}`,
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
            [CURR_CONTEXT_TOGGLE_ID]: toInputBooleanEntityId(getContextToggleId(context)),
            [FIRST_INF_CONTEXT_SCRIPT]: toScriptEntityId(getInfContextHandlerScriptId(light, context)),
            [ATTACH_VARS_SCRIPT_ID]: toScriptEntityId(getVarAttachScriptId(light, context)),
            [DETACH_VARS_SCRIPT_ID]: toScriptEntityId(getVarDetachScriptId(light, context))
          }
        }
      })
    }

    return script
  })
}
import { Layer } from "../fsfr-types/Layer"
import { Light } from "../fsfr-types/Light"
import { getSceneToggleId } from "../fsfr-types/Scene"
import { Script } from "../ha-config-types/Script"
import { getApplySceneToLightScriptId, getInfSceneHandlerScriptId, getSupSceneHandlerScriptId, getSupSceneOnListenerScript, toInputBooleanEntityId, toScriptEntityId } from "./IdGenerators"
import { ATTACH_VARS_IN_SCENE_ID, CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE, DETACH_VARS_IN_SCENE_ID, FIRST_INF_SCENE_SCRIPT } from "./VariableConstants"

export function lightSceneApplyScripts(light: Light) {
  return light.layers.map((layer, idx, layers) => {

    const { scene } = layer

    const script: Script = new Script({
      id: getApplySceneToLightScriptId(scene, light),
      alias: `SCRIPT: Apply scene ${scene.id} to light`
    })
    .addAction({
      alias: "ACTION: Turn off superior scene on listener",
      service: "script.turn_off",
      target: {
        entity_id: toScriptEntityId(getSupSceneOnListenerScript(light))
      }
    })
    .addAction({
      alias: `ACTION: Detach variables of ${light} in ${scene}`,
      service: `{{ ${DETACH_VARS_IN_SCENE_ID} }}`,
    })
    .addAction({
      alias: `ACTION: Attach variables of ${light} in ${scene}`,
      service: `{{ ${ATTACH_VARS_IN_SCENE_ID} }}`,
    })
    .addAction({
      alias: `ACTION: turn on light ${light.id} with data of ${scene}`,
      service: "light.turn_on",
      target: {entity_id: light.entityId},
      data: layer.style.data
    })

    const firstSuperiorLayer: Layer | undefined = layers[idx +1]

    if(firstSuperiorLayer) {
      script.addAction({
        alias: "ACTION: Turn on the first superior scene handler",
        service: "script.turn_on",
        target: {entity_id: toScriptEntityId(getSupSceneHandlerScriptId(light, firstSuperiorLayer.scene))},
        data: {
          variables: {
            [CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE]: toInputBooleanEntityId(getSceneToggleId(scene)),
            [FIRST_INF_SCENE_SCRIPT]: toScriptEntityId(getInfSceneHandlerScriptId(light, scene))
          }
        }
      })
    }

    const firstInferiorLayer: Layer | undefined = layers[idx - 1]

    if(firstInferiorLayer) {
      script.addAction({
        alias: `ACTION: Turn on the first inferior scene handler`,
        service: "script.turn_on",
        target: {entity_id: toScriptEntityId(getInfSceneHandlerScriptId(light, firstInferiorLayer.scene))},
        data: {
          variables: {
            [CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE]: toInputBooleanEntityId(getSceneToggleId(scene)),
            [FIRST_INF_SCENE_SCRIPT]: toScriptEntityId(getInfSceneHandlerScriptId(light, scene))
          }
        }
      })
    }

    return script
  })
}
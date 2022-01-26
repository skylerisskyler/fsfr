import { Layer } from '../fsfr-types/Layer'
import { Light } from '../fsfr-types/Light'
import { getSceneToggleId } from '../fsfr-types/Scene'
import { ChooseAction, ChooseActionChoice } from '../ha-config-types/Action'
import { Script } from '../ha-config-types/Script'
import { getApplySceneToLightScriptId, getDefaultId, getInfCurrSceneOffListenerId, getInfSceneHandlerScriptId, getInfSceneOffListenerId, getInfSceneOnListenerId, getSupSceneHandlerScriptId, getSupSceneOnListenerScript, toInputBooleanEntityId, toScriptEntityId } from './IdGenerators'
import { CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE, FIRST_INF_SCENE_SCRIPT, infSceneLoopVariables, NAMESPACE_FOR_APPLY_SCENE_SCRIPT_VAR } from './VariableConstants'

export function createInfHandlerScripts(light: Light) {

  const scripts: Script[] =  light.layers
    .slice(1)
    .map((layer, idx, layers) => {

      const { scene } = layer

      const script: Script = new Script({
        id: getInfSceneHandlerScriptId(light, scene),
        alias: `SCRIPT: Handle inferior scene ${scene.id} for ${light.id}`,
      })

      const onChoice = new ChooseActionChoice(`if ${scene.id} is on`)
        .addCondition({
          alias: `CONDITION: check ${scene.id} toggle is on`,
          condition: 'state',
          entity_id: toInputBooleanEntityId(getSceneToggleId(scene)),
          state: 'on'
        })
        .addAction({
          alias: `ACTION: initialize current scene off listener`,
          service: 'script.turn_on',
          target: {entity_id: toScriptEntityId(getInfCurrSceneOffListenerId(light))}, //yellow
          data: {
            variables: {
              CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE: `{{ ${CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE} }}`,
              callback: toScriptEntityId(getApplySceneToLightScriptId(scene, light))
            }
          }
        })
        .addAction({
          alias: `ACTION: initialize ${scene.id} scene off listener`,
          service: 'script.turn_on',
          target: {entity_id: toScriptEntityId(getInfSceneOffListenerId(light))}, //purple
          data: {
            variables: {
              ...infSceneLoopVariables
            }
          }
        })

      const offChoice = new ChooseActionChoice(`if ${scene.id} is off`)
      .addCondition({
        alias: `CONDITION: check ${scene.id} is off`,
        condition: 'state',
        entity_id: toInputBooleanEntityId(getSceneToggleId(scene)),
        state: 'off'
      })
      .addAction({
        alias: "ACTION: Initialize this scene on listener",
        service: 'script.turn_on',
        target: {entity_id: toScriptEntityId(getInfSceneOnListenerId(light)) }, //blue
        data: {
          variables: {
            ...infSceneLoopVariables,
            [FIRST_INF_SCENE_SCRIPT]: FIRST_INF_SCENE_SCRIPT,
            [CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE]: CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE,
          }
        }
      })

    const nextLayer: Layer | undefined = layers[idx + 1]

    if(nextLayer) {

      offChoice.addAction({
        alias: `ACTION: turn on next scene ${nextLayer.scene.id} handler`,
        service: 'script.turn_on',
        target: {entity_id: toScriptEntityId(getInfSceneHandlerScriptId(light, nextLayer.scene))},
        data: {
          variables: {
            ...infSceneLoopVariables,
          }
        }
      })
    } else {
      offChoice.addAction({
        alias: `ACTION: Turn on default layer of none other exists`,
        service: 'script.turn_on',
        target: {entity_id: toScriptEntityId(getDefaultId(light))},
      })
    }

    script
      .addAction(
        new ChooseAction('Is inferior scene on or off?')
        .addChoice(offChoice)
        .addChoice(onChoice)
      )

    return script
  })

  const defaultScript: Script = new Script({
    alias: `SCRIPT: default`,
    id: getDefaultId(light),
  })

  if(!light.default) {
    defaultScript.addAction({
      alias: `ACTION: turn off ${light.id}`,
      service: 'light.turn_off',
      target: {entity_id: light.entityId}
    })
  }
    
  scripts.push(defaultScript)

  return scripts
}

export function createSuperiorSceneHandlerScripts(light: Light) {

  const scripts: Script[] =  light.layers
    .reverse()
    .slice(1)
    .map((layer, idx, layers) => {

      const { scene } = layer

      const script: Script = new Script({
        id: toScriptEntityId(getSupSceneHandlerScriptId(light, scene)),
        alias: 'SCRIPT: Superior scene handler'
      })
      .addAction({
        service: 'script.turn_on',
        target: {entity_id: toScriptEntityId(getSupSceneOnListenerScript(light))},
        data: {
          variables: {
            [NAMESPACE_FOR_APPLY_SCENE_SCRIPT_VAR]: toScriptEntityId(getApplySceneToLightScriptId(scene, light)),
          }
        }
      })

      const nextLayer: Layer | undefined = layers[idx + 1]

      if(nextLayer) {
        script.addAction({
          alias: `ACTION: turn on next scene ${nextLayer.scene.id} handler`,
          service: 'script.turn_on',
          target: {entity_id: toScriptEntityId(getSupSceneHandlerScriptId(light, nextLayer.scene))},
        })
      }

      return script
    })

  return scripts
}

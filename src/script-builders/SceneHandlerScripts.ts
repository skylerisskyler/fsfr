import { Layer } from '../fsfr-types/Layer'
import { Light } from '../fsfr-types/Light'
import { getSceneToggleId } from '../fsfr-types/Scene'
import { ChooseAction, ChooseActionChoice } from '../ha-config-types/Action'
import { Script } from '../ha-config-types/Script'
import { getApplySceneToLightScriptId, getDefaultId, getInfCurrSceneOffListenerId, getInfSceneHandlerScriptId, getInfSceneOffListenerId, getInfSceneOnListenerId, getSupSceneHandlerScriptId, getSupSceneOnListenerScript, toInputBooleanEntityId, toScriptEntityId } from './IdGenerators'
import { APPLY_SCENE_SCRIPT_ID, globalScriptVariables, INF_SCENE_TOGGLE_ID, SUP_SCENE_TOGGLE_ID } from './VariableConstants'

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
              ...globalScriptVariables,
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
              ...globalScriptVariables
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
        alias: `ACTION: Initialize ${scene.id} scene on listener`,
        service: 'script.turn_on',
        target: {entity_id: toScriptEntityId(getInfSceneOnListenerId(light)) }, //blue
        data: {
          variables: {
            ...globalScriptVariables,
            [INF_SCENE_TOGGLE_ID]: toInputBooleanEntityId(getSceneToggleId(scene))
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
            ...globalScriptVariables
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
        .addChoice(onChoice)
        .addChoice(offChoice)
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

export function createSupHandlerScripts(light: Light) {

  const scripts: Script[] =  light.layers
    .reverse()
    .slice(1)
    .map((layer, idx, layers) => {

      const { scene } = layer

      const script: Script = new Script({
        id: getSupSceneHandlerScriptId(light, scene),
        alias: `SCRIPT: Superior scene handler ${scene.id}`
      })
      .addAction({
        alias: `ACTION: turn on ${scene.id} on listener`,
        service: 'script.turn_on',
        target: {entity_id: toScriptEntityId(getSupSceneOnListenerScript(light))},
        data: {
          variables: {
            ...globalScriptVariables,
            [SUP_SCENE_TOGGLE_ID]: toInputBooleanEntityId(getSceneToggleId(scene)),
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

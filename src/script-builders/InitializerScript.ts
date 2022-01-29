import { Light } from "../fsfr-types/Light";
import { ChooseAction, ChooseActionChoice } from "../ha-config-types/Action";
import { Script } from "../ha-config-types/Script";
import { getApplySceneToLightScriptId, getInitializerScriptId, getSceneToggleId, toInputBooleanEntityId, toScriptEntityId } from "./IdGenerators";

export function createInitializerScript(light: Light) {

  const script: Script = new Script({
    id: getInitializerScriptId(light),
    alias: `SCRIPT: Initialize ${light.id}`,
  })

  const choices: ChooseActionChoice[] = light.scenes.map(scene => { 
    const choice = new ChooseActionChoice(`if ${scene.id} is on`)
      .addCondition({
        alias: `CONDITION: check ${scene.id} toggle is on`,
        condition: 'state',
        entity_id: toInputBooleanEntityId(getSceneToggleId(scene)),
        state: 'on'
      })
      .addAction({
        alias: `ACTION: apply scene ${scene.id} to light`,
        service: 'script.turn_on',
        target: {
          entity_id: toScriptEntityId(getApplySceneToLightScriptId(scene, light))
        }
      })

    return choice
  })

  const chooseAction: ChooseAction = new ChooseAction(`Get highest priority scene for light ${light.id}`)

  
  choices.forEach(choice => chooseAction.addChoice(choice))

  chooseAction.addDefault({
    alias: `Default: turn off light`,
    service: 'light.turn_off',
    target: {
      entity_id: light.entityId,
    }
  })

  script.addAction(chooseAction)

  return script
}
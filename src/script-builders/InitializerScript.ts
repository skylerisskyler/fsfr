import { Light } from "../fsfr-types/Light";
import { ChooseAction, ChooseActionChoice } from "../ha-config-types/Action";
import { Script } from "../ha-config-types/Script";
import { getApplyContextToLightScriptId, getInitializerScriptId, getContextToggleId, toInputBooleanEntityId, toScriptEntityId } from "./IdGenerators";

export function createInitializerScript(light: Light) {

  const script: Script = new Script({
    id: getInitializerScriptId(light),
    alias: `SCRIPT: Initialize ${light.id}`,
  })

  const choices: ChooseActionChoice[] = light.contexts.map(context => { 
    const choice = new ChooseActionChoice(`if ${context.id} is on`)
      .addCondition({
        alias: `CONDITION: check ${context.id} toggle is on`,
        condition: 'state',
        entity_id: toInputBooleanEntityId(getContextToggleId(context)),
        state: 'on'
      })
      .addAction({
        alias: `ACTION: apply context ${context.id} to light`,
        service: 'script.turn_on',
        target: {
          entity_id: toScriptEntityId(getApplyContextToLightScriptId(context, light))
        }
      })

    return choice
  })

  const chooseAction: ChooseAction = new ChooseAction(`Get highest priority context for light ${light.id}`)

  
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
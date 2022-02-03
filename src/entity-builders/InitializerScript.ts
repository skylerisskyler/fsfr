import { Light } from "../fsfr-types/Light";
import { ChooseAction, ChooseActionChoice } from "../ha-config-types/Action";
import { Script, ScriptProps } from "../ha-config-types/Script";
import {
  getApplyContextToLightScriptId,
  getInitializerScriptId,
  getContextToggleId,
  toInputBooleanEntityId,
  toScriptEntityId,
  getVarAttachScriptId,
  getVarDetachScriptId,
  getApplyDefaultToLightScriptId
} from "./IdGenerators";
import {
  CURR_CONTEXT_TOGGLE_ID,
  DETACH_VARS_SCRIPT_ID 
} from "./VariableConstants";

export function createInitializerScript(light: Light): ScriptProps {

  const script: Script = new Script({
    id: getInitializerScriptId(light),
    alias: `SCRIPT: Initialize ${light.id}`,
  })

  const choices: ChooseActionChoice[] = light.layers.map(layer => { 
    const { context } = layer
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
        },
        data: {
          variables: {
            [DETACH_VARS_SCRIPT_ID]: false,
          }
        }
      })

    return choice
  })

  const chooseAction: ChooseAction = new ChooseAction(`Get highest priority context for light ${light.id}`)

  
  choices.forEach(choice => chooseAction.addChoice(choice))

  chooseAction.addDefault({
    alias: `ACTION: apply default to ${light.id}`,
    service: 'script.turn_on',
    target: {
      entity_id: toScriptEntityId(getApplyDefaultToLightScriptId(light))
    },
    data: {
      variables: {
        [DETACH_VARS_SCRIPT_ID]: false
      }
    }
  })

  script.addAction(chooseAction)

  return script.compile()
}
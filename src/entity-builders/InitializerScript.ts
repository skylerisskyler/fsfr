import { Light } from "../fsfr-types/Light";
import { Automation } from "../ha-config-types";
import { ChooseAction, ChooseActionChoice } from "../ha-config-types/Action";
import { AutomationProps } from "../ha-config-types/Automation";
import { Script, ScriptProps } from "../ha-config-types/Script";
import {
  getApplyContextToLightScriptId,
  getInitializerScriptId,
  getContextToggleId,
  toInputBooleanEntityId,
  toScriptEntityId,
  getApplyDefaultToLightScriptId,
  getInfListerEntityIds,
  getSupContextOnListenerScript
} from "./IdGenerators";
import {
  DETACH_VARS_SCRIPT_ID 
} from "./VariableConstants";

export function createGlobalInitializerAutomation(lights: Light[]): AutomationProps {

  const automation: Automation = new Automation({
    id: 'Initialize lights',
    alias: "Initializer",
  })
  .addTrigger({
    platform: 'homeassistant',
    event: 'start'
  })
  
  lights.forEach(light => {
    automation.addAction({
      service: toScriptEntityId(getInitializerScriptId(light)),
    })
  })

  automation.addAction({
    service: 'notify.notify',
    data: {
      message: 'FSFR: Initialization complete'
    }
  })

  return automation.compile()
}

export function createInitializerScript(light: Light): ScriptProps {

  const script: Script = new Script({
    id: getInitializerScriptId(light),
    alias: `SCRIPT: Initialize ${light.id}`,
  })
  .addAction({
    alias: "ACTION: Turn off superior context on listener",
    service: "script.turn_off",
    target: {
      entity_id: [
        ...getInfListerEntityIds(light),
        toScriptEntityId(getSupContextOnListenerScript(light))
      ]
    }
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
import { Light } from "../fsfr-types/Light"
import { Script } from "../ha-config-types/Script"
import { getInfCurrSceneOffListenerId, getInfSceneOffListenerId, getInfSceneOnListenerId, getTurnOffInfListenersPassthroughId, toScriptEntityId } from "./IdGenerators"
import { FIRST_INF_SCENE_SCRIPT } from "./VariableConstants"

export function createPassthroughScript(light: Light) {

  const script: Script = new Script({
    id: getTurnOffInfListenersPassthroughId(light),
    alias: 'some alias'
  })
  .addAction({
    alias: "ACTION: Turn off inferior scene on listener",
    service: "script.turn_off",
    target: {
      entity_id: toScriptEntityId(getInfSceneOnListenerId(light))
    }
  })
  .addAction({
    alias: "ACTION: Turn off inferior scene off listener",
    service: "script.turn_off",
    target: {
      entity_id: toScriptEntityId(getInfSceneOffListenerId(light))
    }
  })
  .addAction({
    alias: "ACTION: Turn off current scene off listener",
    service: "script.turn_off",
    target: {
      entity_id:  toScriptEntityId(getInfCurrSceneOffListenerId(light))
    }
  })
  .addAction({
    alias: "ACTION: Call apply scene or scene handler",
    service: "script.turn_on",
    target: {
      entity_id: `{{ call_back }}`
    },
    data: {
      variables: {
        [FIRST_INF_SCENE_SCRIPT]: FIRST_INF_SCENE_SCRIPT
      }
    }
  })

  return script

}
import { Light } from "../fsfr-types/Light"
import { Script } from "../ha-config-types/Script"
import { getInfCurrContextOffListenerId, getInfContextOffListenerId, getInfContextOnListenerId, getTurnOffInfListenersPassthroughId, toScriptEntityId } from "./IdGenerators"
import { globalScriptVariables } from "./VariableConstants"

export function createPassthroughScript(light: Light) {

  const script: Script = new Script({
    id: getTurnOffInfListenersPassthroughId(light),
    alias: `SCRIPT: Passthrough for ${light.id}`
  })
  .addAction({
    alias: "ACTION: Turn off inferior context on listener",
    service: "script.turn_off",
    target: {
      entity_id: toScriptEntityId(getInfContextOnListenerId(light))
    }
  })
  .addAction({
    alias: "ACTION: Turn off inferior context off listener",
    service: "script.turn_off",
    target: {
      entity_id: toScriptEntityId(getInfContextOffListenerId(light))
    }
  })
  .addAction({
    alias: "ACTION: Turn off current context off listener",
    service: "script.turn_off",
    target: {
      entity_id: toScriptEntityId(getInfCurrContextOffListenerId(light))
    }
  })
  .addAction({
    alias: "ACTION: Call apply context or context handler",
    service: "script.turn_on",
    target: {
      entity_id: `{{ callback }}`
    },
    data: {
      variables: {
        ...globalScriptVariables
      }
    }
  })

  return script.compile()

}
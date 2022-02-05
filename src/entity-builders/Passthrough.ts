import { Light } from "../fsfr-types/Light"
import { Script } from "../ha-config-types/Script"
import { getInfCurrContextOffListenerId, getInfContextOffListenerId, getInfContextOnListenerId, getTurnOffInfListenersPassthroughId, toScriptEntityId, getInfListerEntityIds } from "./IdGenerators"
import { DETACH_VARS_SCRIPT_ID, FIRST_INF_HANDLER_SCRIPT_ID, persistentInfVariables } from "./VariableConstants"

export function createResetInfListenersScript(light: Light) {

  const script: Script = new Script({
    id: getTurnOffInfListenersPassthroughId(light),
    alias: `SCRIPT: Passthrough for ${light.id}`
  })
  .addAction({
    alias: "ACTION: Turn off inferior context on listener",
    service: "script.turn_off",
    target: {
      entity_id: [
        ...getInfListerEntityIds(light),
      ]
    }
  })
  .addAction({
    alias: "ACTION: Call apply context or context handler",
    service: "script.turn_on",
    target: {
      entity_id: `{{ ${FIRST_INF_HANDLER_SCRIPT_ID} }}`
    },
    data: {
      variables: {
        ...persistentInfVariables,
      }
    }
  })

  return script.compile()

}
import { Light } from "../fsfr-types/Light"
import { Action } from "../ha-config-types/Action"
import { Script } from "../ha-config-types/Script"
import { getInfCurrContextOffListenerId, getInfContextOffListenerId, getInfContextOnListenerId, toScriptEntityId } from "./IdGenerators"


export function createInfListenerOffAction(light: Light) {

  const action: Action = ({
    alias: "ACTION: turn off inferior listeners",
    service: "script.turn_off",
    target: {
      entity_id: [
        toScriptEntityId(getInfContextOnListenerId(light)),
        toScriptEntityId(getInfContextOffListenerId(light)),
        toScriptEntityId(getInfCurrContextOffListenerId(light))
      ]
    }
  })

  return action
}
import { Light } from "../fsfr-types/Light"
import { Script } from "../ha-config-types/Script"
import { Variable } from "../fsfr-types/Variable"
import { getVarAttachScriptId, getVarDetachScriptId } from "./IdGenerators"


export function createVarAttachScripts(light: Light): Script[] {

  return light.layers.map(layer => {
    
    const { scene } = layer

    const script: Script = new Script({
      id: getVarAttachScriptId(light, scene),
      alias: 'some alias'
    })

    layer.style.variables.forEach((variable: Variable) => {
      script.addAction({
        service: 'script.turn_on',
        target: {entity_id: `script.util_add_light_to_var`},
        data: {
          variables: {
            light_to_add: light.entityId
          }
        }
      })
    })

    return script
    
  })
}

export function createVarDetachScripts(light: Light): Script[] {

  return light.layers.map(layer => {
    
    const { scene } = layer

    const script: Script = new Script({
      id: getVarDetachScriptId(light, scene),
      alias: 'some alias'
    })

    layer.style.variables.forEach((variable: Variable) => {
      script.addAction({
        service: 'script.turn_on',
        target: {entity_id: `script.util_remove_light_from_var`},
        data: {
          variables: {
            light_to_remove: light.entityId
          }
        }
      })
    })

    return script
    
  })
}
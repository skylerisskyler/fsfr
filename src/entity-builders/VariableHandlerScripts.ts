import { Light } from "../fsfr-types/Light"
import { Script } from "../ha-config-types/Script"
import { Variable } from "../fsfr-types/Variable"
import { addVariableToGroupId, getVarAttachScriptId, getVarDetachScriptId, getVariableGroupId, removeVariableFromGroupId, toGroupEntityId, toScriptEntityId } from "./IdGenerators"
import { GROUP_ID, LIGHT_ID } from "./VariableConstants"


export function createVarAttachScripts(light: Light): Script[] {

  return light.layers.map(layer => {
    
    const { context } = layer

    const script: Script = new Script({
      id: getVarAttachScriptId(light, context),
      alias: `SCRIPT: Attach variables of ${light.id} in ${context.id}`
    })

    layer.style.variables.forEach((variable: Variable) => {
      script.addAction({
        service: 'script.turn_on',
        target: {entity_id: toScriptEntityId(addVariableToGroupId)},
        data: {
          variables: {
            [GROUP_ID]: getVariableGroupId(variable),
            [LIGHT_ID]: light.entityId,
          }
        }
      })
    })

    return script.compile()
    
  })
}

export function createVarDetachScripts(light: Light): Script[] {

  return light.layers.map(layer => {
    
    const { context } = layer

    const script: Script = new Script({
      id: getVarDetachScriptId(light, context),
      alias: `SCRIPT: Detach variables of ${light.id} in ${context.id}`
    })

    layer.style.variables.forEach((variable: Variable) => {
      script.addAction({
        service: 'script.turn_on',
        target: {entity_id:  toScriptEntityId(removeVariableFromGroupId)},
        data: {
          variables: {
            [GROUP_ID]: getVariableGroupId(variable),
            [LIGHT_ID]: light.entityId,
          }
        }
      })
    })

    return script.compile()
    
  })
}
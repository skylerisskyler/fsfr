import { Variable } from "../fsfr-types/Variable"
import { Automation } from "../ha-config-types/Automation"
import { getVariableGroupId, getVariableInputId, toGroupEntityId, toInputBooleanEntityId, toInputNumberEntityId } from "./IdGenerators"

function variableUpdateScripts(variable: Variable) {
  const automation = new Automation({
    id: getVariableInputId(variable),
    alias: `AUTOMATION: Handle change variable ${variable.namespace} `,
  })
  .addTrigger({
    platform: 'state',
    entity_id: toInputNumberEntityId(getVariableInputId(variable)),
  })
  .addAction({
    service: 'group.turn_on',
    target: {
      entity_id: toGroupEntityId(getVariableGroupId(variable)),
    },
    data: {
      [variable.type]: `{{ states.${toInputNumberEntityId(getVariableInputId(variable))} }}`,
    }
  })

}
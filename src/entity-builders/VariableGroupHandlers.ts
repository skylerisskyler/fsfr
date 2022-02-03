import { Script } from "../ha-config-types/Script";
import { addVariableToGroupId, removeVariableFromGroupId } from "./IdGenerators";
import { GROUP_ID, LIGHT_ID } from "./VariableConstants";

export function createAddLightToVarScript() {
  const script: Script = new Script({
    id: addVariableToGroupId,
    alias: "SCRIPT: Util add light to variable",
  })
  .addAction({
    service: 'group.set',
    data: {
      object_id: "{{ group_id }}",
      entities: `{{ state_attr('group.' + ${GROUP_ID}, 'entity_id') | list + [${LIGHT_ID}] }}`
    }
  })

  return script.compile()
}

export function createRemoveLightFromVarScript() {
  const script: Script = new Script({
    id: removeVariableFromGroupId,
    alias: "SCRIPT: Util remove light from variable",
  })
  .addAction({
    service: 'group.set',
    data: {
      object_id: "{{ group_id }}",
      entities: `{{state_attr('group.' + ${GROUP_ID}, 'entity_id')|reject('equalto', '${LIGHT_ID}')| list}}`
    }
  })

  return script.compile()
}



import { Variable } from "../fsfr-types";
import { Group } from "../ha-config-types/Group";
import { getVariableGroupId } from "./IdGenerators";

export function createVariableGroup(variable: Variable): Group {
  const group: Group = {
    id: getVariableGroupId(variable),
    name: `FSFR: ${variable.namespace}`,
    entities: []
  }
  return group
}
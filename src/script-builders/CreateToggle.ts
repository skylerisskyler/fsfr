import { Context } from "../fsfr-types";
import { InputBoolean } from "../ha-config-types";
import { getContextToggleId } from "./IdGenerators";

export function createToggle(context: Context): InputBoolean {
    return {
      id: getContextToggleId(context),
      icon: 'mdi: landscape',
      name: 'Toggle context: ' + context.id,
      initial: false
    }
  }
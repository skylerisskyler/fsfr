import { Condition } from './Condition'
import { Action } from './Action'
import { Mode, ForDict } from './Misc'
import { Trigger } from './Trigger'


export interface AutomationConfig {
  id?: string;
  alias?: string;
  description?: string;
  trigger: Trigger | Trigger[];
  condition?: Condition | Condition[];
  action: Action | Action[];
  mode?: Mode;
  max?: number;
  max_exceeded?:
  | "silent"
  | "critical"
  | "fatal"
  | "error"
  | "warning"
  | "warn"
  | "info"
  | "debug"
  | "notset";
  variables?: Record<string, unknown>;
}
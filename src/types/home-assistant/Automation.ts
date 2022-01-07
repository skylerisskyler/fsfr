import { Condition } from './Condition'
import { Action } from './Action'
import { Mode, ForDict } from './Misc'
import { Trigger } from './Trigger'


export interface AutomationProps {
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


export class Automation implements AutomationProps {
  id?: string;
  alias?: string;
  description?: string;
  trigger: Trigger[];
  condition?: Condition[];
  action: Action[];
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

  constructor(props: AutomationProps) {
    this.id = props.id
    this.alias = this.alias
    this.description = this.description

    this.trigger = []
    this.action = []
  }

  addCondition(condition: Condition) {
    this.condition.push(condition)
    return this
  }

  addTrigger(trigger: Trigger) {
    this.trigger.push(trigger)
    return this
  }

}
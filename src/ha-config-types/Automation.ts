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
  | "noet";
  variables?: Record<string, unknown>;
}



export class Automation implements AutomationProps {
  id?: string;
  alias?: string;
  description?: string;
  trigger: Trigger[];
  condition: Condition[];
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
    | "noet";
  variables?: Record<string, unknown>;

  constructor(props: any) {
    this.id = props.id
    this.alias = this.alias
    this.description = this.description

    this.trigger = []
    this.condition = []
    this.action = []
  }

  addTrigger(trigger: Trigger) {
    this.trigger.push(trigger)
    return this
  }

  addAction(action: Action) {
    this.action.push(action)
    return this
  }

  addCondition(condition: Condition) {
    this.condition.push(condition)
    return this
  }

  compile() {
    const compilation: any = {}
    compilation.id = this.id
    compilation.trigger = this.trigger
    compilation.action = this.action
    if(this.condition.length) {
      compilation.condition = this.condition
    }
    return compilation
  }

}
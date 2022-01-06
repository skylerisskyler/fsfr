import { Condition } from './Condition'
import { Action } from './Action'
import { Mode } from './Misc'


export interface ScriptConfig {
  alias: string;
  sequence: Action[];
  icon?: string;
  mode?: Mode
  max?: number;
}

class Script implements ScriptConfig {

  alias: string;
  sequence: Action[];
  icon?: string;
  mode?: Mode;
  max?: number;

  constructor(config: ScriptConfig) {
    this.alias = config.alias
    this.sequence = []
    this.icon = config.icon
    this.mode = config.mode
    this.max = config.max
  }

  addSequence(action: Action) {
    this.sequence.push(action)
  }
}
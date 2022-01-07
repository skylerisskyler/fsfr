import { Condition } from './Condition'
import { Action } from './Action'
import { Mode } from './Misc'


export interface ScriptProps {
  id: string
  alias: string;
  sequence?: Action[];
  icon?: string;
  mode?: Mode
  max?: number;
}



export class Script implements ScriptProps {

  id: string
  alias: string;
  sequence: Action[];
  icon?: string;
  mode?: Mode;
  max?: number;

  constructor(props: ScriptProps) {
    this.alias = props.alias
    this.icon = props.icon
    this.mode = props.mode
    this.max = props.max

    this.sequence = []
  }

  addSequence(action: Action) {
    this.sequence.push(action)
  }
}
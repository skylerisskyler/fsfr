import { Condition } from './Condition.d.ts'
import { Action } from './Action.d.ts'
import { Mode } from './Misc.ts'


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
    this.id = props.id
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
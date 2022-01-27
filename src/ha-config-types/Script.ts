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
    this.id = props.id
    this.alias = props.alias
    this.icon = props.icon
    this.mode = props.mode
    this.max = props.max

    this.sequence = []
  }

  addAction(action: Action) {
    this.sequence.push(action)
    return this
  }

  compile() {
    const compilation: any = {}
    compilation.alias = this.alias
    compilation.id = this.id
    compilation.sequence = this.sequence
    return compilation
  }
}
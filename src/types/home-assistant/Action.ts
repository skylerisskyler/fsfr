import { Condition } from './Condition.d.ts'


export interface ServiceAction {
  alias?: string;
  service?: string;
  service_template?: string;
  entity_id?: string | string[];
  target?: HassServiceTarget;
  data?: Record<string, any>;
}

export declare type HassServiceTarget = {
  entity_id?: string | string[];
  device_id?: string | string[];
  area_id?: string | string[];
}

export interface IChooseActionChoice {
  alias?: string;
  conditions: string | Condition[];
  sequence: Action | Action[];
}

export interface IChooseAction {
  alias?: string;
  choose: ChooseActionChoice | ChooseActionChoice[] | null;
  default?: Action | Action[];
}


export type Action =
  | Condition
  | ServiceAction
  | IChooseAction
// | EventAction
// | DeviceAction
// | DelayAction
// | SceneAction
// | WaitAction
// | WaitForTriggerAction
// | RepeatAction
// | VariablesAction
// | UnknownAction;

export class ChooseActionChoice implements IChooseActionChoice {
  alias?: string;
  conditions: Condition[];
  sequence: Action[];

  constructor(alias: string) {
    this.alias = alias
    this.conditions = []
    this.sequence = []
  }

  addCondition(condition: Condition) {
    this.conditions.push(condition)
  }

  addSequence(action: Action) {
    this.sequence.push(action)
  }
}

export class ChooseAction implements IChooseAction{

  alias?: string;
  choose: ChooseActionChoice[]
  default: Action[];
  
  constructor(alias: string) {
    this.alias = alias
    this.choose = []
    this.default = []
  }

  addChoice(choice: ChooseActionChoice) {
    this.choose.push(choice)
  }

  addDefault(action: Action) {
    this.default.push(action)
  }
}
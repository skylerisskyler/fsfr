export interface ForDict {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

interface BaseCondition {
  condition: string;
  alias?: string;
}

export interface StateCondition extends BaseCondition {
  condition: "state";
  entity_id: string;
  attribute?: string;
  state: string | number | string[];
  for?: string | number | ForDict;
}

export type Condition =
  | StateCondition
// | NumericStateCondition
// | SunCondition
// | ZoneCondition
// | TimeCondition
// | TemplateCondition
// | DeviceCondition
// | LogicalCondition
// | TriggerCondition;


import { ForDict } from './Misc'


export interface BaseTrigger {
  platform: string;
  id?: string;
}

export interface StateTrigger extends BaseTrigger {
  platform: "state";
  entity_id: string;
  attribute?: string;
  from?: string | number;
  to?: string | string[] | number;
  for?: string | number | ForDict;
}



export type Trigger =
  | StateTrigger
// | MqttTrigger
// | GeoLocationTrigger
// | HassTrigger
// | NumericStateTrigger
// | SunTrigger
// | TimePatternTrigger
// | WebhookTrigger
// | ZoneTrigger
// | TagTrigger
// | TimeTrigger
// | TemplateTrigger
// | EventTrigger
// | DeviceTrigger;
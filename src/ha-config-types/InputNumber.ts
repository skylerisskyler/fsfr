export interface InputNumber {
  id?: string;
  name: string;
  min: number;
  max: number;
  step: number;
  mode: "box" | "slider";
  icon?: string;
  initial?: number;
  unit_of_measurement?: string;
}
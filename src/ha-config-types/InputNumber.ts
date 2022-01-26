export interface InputNumberProps {
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

export interface InputNumberConf {
  [id: string]: InputNumberProps
}

export interface InputNumberInput extends InputNumberProps {
  id: string
  name: string
  min: number
  max: number
  step: number
  mode: "box" | "slider"
  icon?: string
  initial?: number
  unit_of_measurement?: string
}

// const createTemperatureInput = (temperatureInput: TemperatureInput) => {

//   let unit_of_measurement: string
//   const icon = "mdi:thermometer"

//   switch (unit_of_measurement) {
//     case 'kelvin':
//       unit_of_measurement = 'K'
//       break;
//     case 'mired':
//       unit_of_measurement = 'M'
//       break;

//     default:
//       throw new Error('Unit of measurement does not exist.')
//       break;
//   }

//   const config: InputNumberConfig = {
//     id: temperatureInput.id + '_' + 'temp',
//     name: temperatureInput + ' ' + 'temperature',
//     min: temperatureInput.min,
//     max: temperatureInput.max,
//     step: temperatureInput.step,
//     mode: 'slider',
//     icon,
//     initial: temperatureInput.initial,
//     unit_of_measurement
//   }
//   return new InputNumber(config)
// }

// const createBrightnessInput = (config: TemperatureInput) => {

//   let unit_of_measurement: string
//   let min: number
//   let max: number
//   const icon = "mdi:brightness-6"

//   switch (unit_of_measurement) {
//     case 'percentage':
//       unit_of_measurement = '%'
//       min = config.min && config.min <= 100 ? config.min : 0
//       max = config.max && config.max <= 100 ? config.max : 100
//       break;

//     case '8bit':
//       min = config.min && config.min <= 100 ? config.min : 0
//       max = config.max && config.max <= 100 ? config.max : 255
//       unit_of_measurement = '/255'
//       break;

//     default:
//       throw new Error('Unit of measurement does not exist.')
//       break;
//   }

//   const myConfig: InputNumberConfig = {
//     id: config.id + '_' + 'bri',
//     name: config + ' ' + 'brightness',
//     min: config.min,
//     max: config.max,
//     step: config.step,
//     mode: 'slider',
//     icon,
//     initial: config.initial,
//     unit_of_measurement
//   }
//   return new InputNumber(myConfig)
// }
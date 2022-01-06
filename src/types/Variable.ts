import { InputNumberConfig } from './home-assistant/InputNumber'


const ID_PREFIX = 'fsfr'
const ALIAS_PREFIX = 'FSFR'


const ranges = {
  temperature: {
    mired: [0, 200],
    kelvin: [1700, 8000]
  },
  brightness: {
    percentage: [0, 100],
    uint8: [0, 255]
  }
}

export interface IVariable {
  namespace: string
  type: 'brightness' | 'temperature',
  unit: 'percentage' | 'uint8' | 'kelvin' | 'mired'
  min?: number
  max?: number
}

interface ConfigForm {
  [id: string]: InputNumberConfig
}

export const variablesFromConfig = (variablesConf: IVariable[]) => {
  return variablesConf.map((variableProps: IVariable) => {
    return new Variable(variableProps)
  })
}

const getRange = (type: string, unit: string, min: number, max: number) => {
  const [MIN, MAX] = ranges[type][unit]
  //TODO FIX / CATCH ERRORS IN RANGE LIKE ABOVE OR BELOW RANGE
  return [MIN, MAX]
}


export class Variable implements IVariable {

  namespace: string
  type: 'brightness' | 'temperature';
  unit: 'percentage' | 'uint8' | 'kelvin' | 'mired';
  min: number
  max: number

  constructor(config: IVariable) {
    this.namespace = config.namespace
    this.type = config.type
    this.unit = config.unit

    const [min, max] = getRange(config.type, this.unit, config.min, config.max)
    this.min = min
    this.max = max
  }



  compile() {

    const inputNumber: InputNumberConfig = {
      name: `[${ALIAS_PREFIX}] var ${this.namespace} ${this.type} ${this.unit}`,
      min: this.min,
      max: this.max,
      step: 1,
      mode: 'slider',
      //TODO: HANDLE UNIT OF MEASUREMENT ABRIVIATIONS
      unit_of_measurement: 'UNIT'
    }

    return {
      ['input_number']: {
        [`${ID_PREFIX}_var_${this.namespace.replace('-', '_')}`]: inputNumber
      }
    }
  }
}
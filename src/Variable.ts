import { ID_PREFIX } from "./App"
import { InputNumberProps } from "./types/home-assistant/InputNumber"


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

const getRange = (type: string, unit: string, min: number, max: number) => {
  const [MIN, MAX] = ranges[type][unit]
  //TODO FIX / CATCH ERRORS IN RANGE LIKE ABOVE OR BELOW RANGE
  return [MIN, MAX]
}

export interface IVariable {
  namespace: string
  type: 'brightness' | 'temperature',
  unit: 'percentage' | 'uint8' | 'kelvin' | 'mired'
  min?: number
  max?: number
}

export const createVariableInput = (variable: Variable, inputNumbers: InputNumberProps[]) => {

  inputNumbers.push(
    {
      name: `${ID_PREFIX}_var_${variable.namespace}`,
      min: variable.min,
      max: variable.max,
      step: 1,
      mode: 'slider'
    }
  )
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
}
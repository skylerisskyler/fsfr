import { getVariableInputId, toInputBooleanEntityId } from "../entity-builders/IdGenerators"
import { InputNumber } from "../ha-config-types"

const range = {
  temperature: {
    mired: {
      min: 0,
      max: 200
    },
    kelvin: {
      min: 1700,
      max: 8000
    }
  },
  brightness: {
    percentage: {
      min: 0,
      max: 100
    },
    uint8: {
      min: 0,
      max: 255
    }
  }
}

interface VariableParams {
  type: string,
  unit: string,
  min?: string | number,
  max?: string | number
}

const getRange = ({type, unit, min, max}: VariableParams) => {
  switch (type) {
    case 'temperature':
      if(unit === 'kelvin') {
        min = min || range.temperature.kelvin.min
        max = max || range.temperature.kelvin.max
      } else if (unit === 'mired') {
        min = min || range.temperature.mired.min
        max = max || range.temperature.mired.max
      } else {
        throw new Error(`Unit ${unit} is not supported for ${type}`)
      }
      break
      
    case 'brightness':
      if(unit === 'percentage') {
        min = min || range.brightness.percentage.min
        max = max || range.brightness.percentage.max
      } else if (unit === 'uint8') {
        min = min || range.brightness.uint8.min
        max = max || range.brightness.uint8.max
    } else {
      throw new Error(`Unit ${unit} is not supported for ${type}`)
    }
    break;
      
    default:
      throw new Error(`Type ${type} is not supported for variable`)
  }
  return [min, max]
}

export interface IVariable {
  namespace: string
  type: 'brightness' | 'temperature',
  unit: 'percentage' | 'uint8' | 'kelvin' | 'mired'
  min?: number
  max?: number
}



export const createVariableInput = (variable: Variable): InputNumber => {

  return {
    id: getVariableInputId(variable),
    name: 'Input variable: ' + variable.namespace,
    min: variable.min,
    max: variable.max,
    step: 1,
    mode: 'slider'
  }
  
}

export class Variable implements IVariable {

  namespace: string
  type: 'brightness' | 'temperature';
  unit: 'percentage' | 'uint8' | 'kelvin' | 'mired';
  min: number 
  max: number

  constructor(conf: IVariable) {

    this.namespace = conf.namespace.replaceAll('-', '_')
    this.type = conf.type
    this.unit = conf.unit

    const [min, max] = getRange({
      type: conf.type,
      unit: conf.unit,
      min: conf.min,
      max: conf.max
    })

    this.min = +min
    this.max = +max
  }

  get key(): string {
    return 'brightness_pct' // TODO: make this configurable
  }

  get value(): string {
    return `{{ states('${toInputBooleanEntityId(getVariableInputId(this))}') | int }}`
  }
}
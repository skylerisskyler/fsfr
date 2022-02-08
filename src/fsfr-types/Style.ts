import { getVariableInputId, toInputNumberEntityId } from "../entity-builders/IdGenerators"
import { IVariable, Variable } from "./Variable"
import cssColorNames from '../css-color-list'


export interface StyleConf {
  [id: string]: StyleConfAttributes
}

export interface StyleConfAttributes {
  brightness?: string | number | IVariable
  color?: string | IVariable
  ['color_name']?: string | IVariable
  temperature?: string | number | IVariable
}

export interface StyleVariables {
  brightness?: Variable
  color?: Variable
  temperature?: Variable
}

interface StyleProp {
  value: number | string
  type: 'brightness' | 'color' | 'temperature'
  unit: 'percentage' | 'uint8' | 'kelvin' | 'mired' | 'name' | 'hex'
}


export class Style {
  id: string | null
  properties: (StyleProp | Variable)[]


  constructor(id: string | null, styleInput: StyleConfAttributes, variables: Variable[]) {

    this.id = id
    this.properties = []

    const checkPropExists = (type: string) => this.properties.find(prop => prop.type === type)  

    Object.entries(styleInput || {}).forEach(([prop, value]) => {

      const isVariableRef = value[0] === '$'
      if (isVariableRef) {
        const namespace = (value as string).slice(1).replaceAll('-', '_')
        const variable: Variable | undefined = variables.find((variable: Variable) => variable.namespace === namespace)
        if(variable) {
          this.properties.push(variable)
        } else {
          throw new Error(`variable namespace ${namespace} is not defined in config`)
        }
      } else {

        if(checkPropExists(prop)){
          throw new Error(`brightness is already defined`)
        } else if(!['brightness', 'color', 'temperature'].includes(prop)) {
          throw new Error(`${prop} is not a valid property`)
        }

        if(typeof(value) === 'number') {
          if(value > 255) {
            throw new Error(`${value} is not a valid value for ${prop}`)
          }
          if(prop === 'temperature') {
            this.properties.push({
              value,
              type: 'temperature',
              unit: 'kelvin'
            })
          }
        }
      
        switch (value[value.length - 1].toLowerCase()) {

          case '%':
            if(prop !== 'brightness') {
              throw new Error(`${value} is not valid for brightness`)
            }
            this.properties.push({
              value: parseInt(value.slice(0, -1)),
              type: 'brightness',
              unit: 'percentage'
            })
            break;

          case 'k':
            if(prop !== 'temperature') {
              throw new Error(`${value} is not valid for temperature`)
            }
            this.properties.push({
              value: parseInt(value.slice(0, -1)),
              type: 'temperature',
              unit: 'kelvin'
            })
            break;

          case 'm':
            if(prop !== 'temperature') {
              throw new Error(`${value} is not valid for temperature`)
            }
            this.properties.push({
              value: parseInt(value.slice(0, -1)),
              type: 'temperature',
              unit: 'mired'
            })
            break;
        
          default:
            if(prop !== 'color') {
              throw new Error(`${value} is not valid format`)
            } else {
              const colorName = cssColorNames.find(color => color === value)
              if(colorName) {
                this.properties.push({
                  value: colorName,
                  type: 'color',
                  unit: 'name'
                })
              } else {
                if(value instanceof Array) {
                  if(value.length > 3) {
                    throw new Error(`${value} is not valid format for rgb`)
                  }
                } else if(value[0] === '#') {
                  throw new Error(`HEX is WIP`)
                  //todo handle hex values
                  this.properties.push({
                    value: value.slice(1),
                    type: 'color',
                    unit: 'hex'
                  })
                }
              }
            }
            }
        }
      })

  }

  get data() {
    const data: any = {}
    this.properties.forEach(prop => {

      switch (prop.unit) {
        case 'percentage':
          data['brightness_pct'] = prop.value
          break;
        case 'uint8':
          data['brightness'] = prop.value
          break;
        case 'kelvin':
          data['kelvin'] = prop.value
          break;
        case 'mired':
          data['color_temp'] = prop.value
          break;
        case 'name':
          data['color_name'] = prop.value
          break;
        case 'hex':
          //todo handle hex values
      }
    })
    return data
  }

  get variables(): Variable[] {
    return this.properties.filter(prop => prop instanceof Variable) as Variable[]
  }
}
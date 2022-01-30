import { getVariableInputId, toInputNumberEntityId } from "../entity-builders/IdGenerators"
import { IVariable, Variable } from "./Variable"


export interface StyleConf {
  [id: string]: StyleProps
}

export interface StyleProps {
  brightness?: string | number | IVariable
  color?: string | IVariable
  temperature?: string | number | IVariable
}

export interface StyleVariables {
  brightness?: Variable
  color?: Variable
  temperature?: Variable
}

export class Style {
  id: string | null
  props: StyleProps
  variables: Variable[]

  constructor(id: string | null, styleProps: StyleProps, variables: Variable[]) {

    this.id = id
    this.props = {}
    this.variables = []

    Object.entries(styleProps).forEach(([prop, value]) => {
      if(prop !== 'brightness' &&  prop !== 'temperature' && prop !== 'color') {
        throw new Error(`style prop ${prop} is not valid`)
      }

      const isVariableRef = value[0] === '$'
      if (isVariableRef) {
        const namespace = (value as string).slice(1).replaceAll('-', '_')
        const variable: Variable | undefined = variables
          .find((variable: Variable) => variable.namespace === namespace)
        if(variable) {
          this.variables.push(variable)
        } else {
          throw new Error(`variable namespace ${namespace} is not defined in config`)
        }
      } else if(typeof value === 'object') {
        const variable = new Variable(value)
        variables.push(variable)
        this.variables.push(variable)
      } else {
        if(prop === 'temperature') {
          //TODO: This is a quick fix, needs better unit handling for all units
          value = +value.toLowerCase().replace('k', '')
        }
        this.props[prop] = value
        
      }
    })

  }
  get data() {
    const variableProps = this.variables.reduce((prev, variable) => {
      let key: string
      switch (variable.unit) {
        case 'percentage':
          key = 'brightness_pct'
          break;
        case 'uint8':
          key = 'brightness'
          break;
        case 'kelvin':
          key = 'kelvin'
          break;
        case 'mired':
          key = 'color_temp'
          break;

        default:
          throw new Error('key is not valid')
      }
      return {...prev, 
        [key]: `{{ states('${toInputNumberEntityId(getVariableInputId(variable))}') | int }}`
      }
    }, {})

    return {...this.props, ...variableProps}
  }
}
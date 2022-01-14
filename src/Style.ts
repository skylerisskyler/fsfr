import { IVariable, Variable } from "./Variable.ts"


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
        const namespace = (value as string).slice(1)
        const variable: Variable | undefined = variables.find((variable: Variable) => variable.namespace === namespace)
        if(variable) {
          this.variables.push(variable)
        } else {
          throw new Error('variable is not defined in config')
        }
      } else if(typeof value === 'object') {
        const variable = new Variable(value)
        variables.push(variable)
        this.variables.push(variable)
      } else {
        this.props[prop] = value
        
      }
    })
  }
}
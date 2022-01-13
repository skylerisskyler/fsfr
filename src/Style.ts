import { Variable } from "./Variable"


export interface StyleConf {
  [id: string]: StyleProps
}

export interface StyleProps {
  brightness?: string | number
  color?: string
  temperature?: string | number
}

export interface StyleVariables {
  brightness?: Variable
  color?: Variable
  temperature?: Variable
}

export class Style {
  id: string | null
  props: StyleProps
  variables: StyleVariables

  constructor(id, styleProps: StyleProps, variables: Variable[]) {

    this.id = id
    this.props = {}
    this.variables = {}

    Object.entries(styleProps).forEach(([prop, value]) => {
      const isVariable = value[0] === '$'
      if (isVariable) {
        const namespace = (value as string).slice(1)
        let variable = variables.find((variable: Variable) => variable.namespace === namespace)
        if(variable) {
          this.variables[prop] = variable
        }
      } else {
        this.props[prop] = value
      }
    })
  }
}
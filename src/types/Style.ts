import { Variable } from "./Variable"


export interface StyleConf {
  [id: string]: StyleProps
}

export interface StyleProps {
  brightness?: string | number
  color?: string
  temperature?: string | number
}



export class Style {
  id: string | null
  props: StyleProps

  constructor(id, styleProps: StyleProps, variables?: Variable[]) {
    this.id = id
    this.props = {}
    Object.entries(styleProps)
      .forEach(([prop, value]) => {
        const isVariable = value[0] === '$'
        if (isVariable) {
          const namespace = (value as string).slice(1)
          variables.forEach((variable: Variable) => {
            if (variable.namespace === namespace) {
              this.props[prop] = variable
            }
          })
        } else {
          this.props[prop] = value
        }
      })
  }
}
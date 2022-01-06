export interface InputBooleanConfig {
  id: string;
  name: string;
  icon?: string;
  initial?: boolean;
}

class InputBoolean implements InputBooleanConfig {

  id
  name
  icon
  initial

  constructor(config: InputBooleanConfig) {
    this.id = config.id
    this.name = config.name
    this.initial = config.initial
  }

  get compile() {
    return {
      [this.id]: {
        name: this.name,
        initial: this.initial
      }
    }
  }
}
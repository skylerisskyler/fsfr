export interface InputSelectConfig {
  id: string;
  name: string;
  options: string[];
  icon?: string;
  initial?: string;
}


class InputSelect implements InputSelectConfig {

  name: string
  options: string[]
  constructor(parameters) {

  }
}
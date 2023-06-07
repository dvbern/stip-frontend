export interface AusbildungsgangLand {
  name: string;
  staettes: AusbildungsgangStaette[];
}

export interface AusbildungsgangStaette {
  name: string;
  ausbildungsgangs: Ausbildungsgang[];
}

export interface Ausbildungsgang {
  name: string;
}

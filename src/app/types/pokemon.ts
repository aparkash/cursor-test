export interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
    back_default: string | null;
    front_shiny: string | null;
    back_shiny: string | null;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}

export interface PokemonResponse {
  results: Array<{
    name: string;
    url: string;
  }>;
} 
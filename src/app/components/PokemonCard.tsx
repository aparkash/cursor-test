import Image from 'next/image';
import { Pokemon } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <div className="group relative bg-gradient-to-br from-pokemon-blue/10 to-pokemon-red/10 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Pokemon Type Badge */}
      <div className="absolute top-2 right-2">
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-pokemon-yellow/20 text-pokemon-yellow-800">
          {pokemon.types[0].type.name}
        </span>
      </div>

      {/* Pokemon Image */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <div className="absolute inset-0 bg-white/50 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
        <Image
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          fill
          className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Pokemon Info */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-800 capitalize mb-1">
          {pokemon.name}
        </h3>
        <div className="flex justify-center gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Height</span>
            <p>{pokemon.height / 10}m</p>
          </div>
          <div>
            <span className="font-medium">Weight</span>
            <p>{pokemon.weight / 10}kg</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
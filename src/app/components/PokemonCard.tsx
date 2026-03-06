'use client';
import Image from 'next/image';
import { PokemonDetail } from '../hooks/usePokemon';

export default function PokemonCard({
  pokemon,
  onClick,
}: {
  pokemon: PokemonDetail;
  onClick: () => void;
}) {
  const primary = pokemon.types[0] ?? 'normal';

  return (
    <article
      onClick={onClick}
      className={`pokemon-card type-${primary} cursor-pointer rounded-2xl overflow-hidden text-white shadow-xl flex flex-col justify-between p-5 min-h-72 transition-transform hover:-translate-y-2 hover:shadow-2xl`}
    >
      {/* Top */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold opacity-90">#{String(pokemon.id).padStart(4, '0')}</p>
          <h3 className="text-xl font-black capitalize mt-1">{pokemon.name}</h3>
          <div className="flex gap-2 mt-2">
            {pokemon.types.map(t => (
              <span key={t} className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold capitalize">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Imagen */}
      <div className="flex justify-center my-2">
        <Image
          src={pokemon.sprite}
          alt={pokemon.name}
          width={130}
          height={130}
          className="object-contain drop-shadow-xl"
        />
      </div>

      {/* Meta */}
      <div className="text-sm opacity-90">
        <p>Peso: <strong>{(pokemon.weight / 10).toFixed(1)} kg</strong></p>
        <p>Altura: <strong>{(pokemon.height / 10).toFixed(2)} m</strong></p>
      </div>
    </article>
  );
}

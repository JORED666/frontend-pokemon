'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PokemonDetail } from '../hooks/usePokemon';

const STAT_NAMES: Record<string, string> = {
  hp: 'PS', attack: 'Ataque', defense: 'Defensa',
  'special-attack': 'Atq. Esp.', 'special-defense': 'Def. Esp.', speed: 'Velocidad',
};

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

// Tipos para la respuesta de PokeAPI species
interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string };
}

interface Genus {
  genus: string;
  language: { name: string };
}

interface SpeciesData {
  flavor_text_entries: FlavorTextEntry[];
  genera: Genus[];
  gender_rate: number;
}

interface Props {
  pokemon: PokemonDetail;
  onClose: () => void;
}

export default function PokemonModal({ pokemon, onClose }: Props) {
  const [desc, setDesc]     = useState('Cargando descripción...');
  const [genus, setGenus]   = useState('--');
  const [gender, setGender] = useState('--');

  useEffect(() => {
    if (!pokemon.speciesUrl) return;
    fetch(pokemon.speciesUrl)
      .then(r => r.json())
      .then((d: SpeciesData) => {
        const flavor = d.flavor_text_entries?.find(e => e.language.name === 'es');
        const genera = d.genera?.find(g => g.language.name === 'es');
        setDesc(flavor ? flavor.flavor_text.replace(/\n|\f/g, ' ') : 'Sin descripción en español.');
        setGenus(genera?.genus ?? '--');
        const rate = d.gender_rate;
        if (rate === -1) setGender('Sin género');
        else {
          const f = Math.round((rate / 8) * 100);
          setGender(`♂ ${100 - f}%  ♀ ${f}%`);
        }
      })
      .catch(() => setDesc('No se pudo cargar la descripción.'));
  }, [pokemon.speciesUrl]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-lg w-9 h-9 text-xl font-bold transition-colors"
        >
          ×
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

          {/* Imagen */}
          <div className="flex flex-col items-center gap-3">
            <Image
              src={pokemon.sprite}
              alt={pokemon.name}
              width={260}
              height={260}
              className="object-contain drop-shadow-2xl"
            />
          </div>

          {/* Info */}
          <div>
            <h2 className="text-3xl font-black capitalize mb-1">
              {pokemon.name}
              <span className="text-white/40 text-lg font-mono ml-2">
                #{String(pokemon.id).padStart(4, '0')}
              </span>
            </h2>

            <p className="text-white/70 text-sm mb-4 leading-relaxed">{desc}</p>

            {/* Panel azul */}
            <div className="bg-gradient-to-r from-sky-600 to-sky-500 rounded-xl p-4 mb-4 grid grid-cols-3 gap-3">
              {(
                [
                  ['Altura',      `${(pokemon.height / 10).toFixed(2)} m`],
                  ['Peso',        `${(pokemon.weight / 10).toFixed(1)} kg`],
                  ['Categoría',   genus],
                  ['Género',      gender],
                  ['Habilidades', pokemon.abilities.map(cap).join(', ')],
                ] as [string, string][]
              ).map(([label, val]) => (
                <div key={label}>
                  <div className="text-xs text-white/70">{label}</div>
                  <div className="font-bold text-sm">{val}</div>
                </div>
              ))}
            </div>

            {/* Tipos */}
            <div className="mb-4">
              <p className="font-bold text-sm mb-2">Tipo</p>
              <div className="flex gap-2">
                {pokemon.types.map(t => (
                  <span
                    key={t}
                    className={`pokemon-card type-${t} px-3 py-1 rounded-full text-xs font-bold text-white capitalize`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div>
              <p className="font-bold text-sm mb-2">Puntos base</p>
              <div className="flex flex-col gap-2">
                {pokemon.stats.map(s => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-xs text-sky-300 w-24">
                      {STAT_NAMES[s.name] ?? cap(s.name)}
                    </span>
                    <div className="flex-1 bg-white/10 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-sky-400 rounded-full"
                        style={{ width: `${Math.min((s.value / 150) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold w-8 text-right">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';

export interface PokemonBasic {
  name: string;
  url: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  types: string[];
  stats: { name: string; value: number }[];
  sprite: string;
  height: number;
  weight: number;
  abilities: string[];
  speciesUrl: string;
}

export function usePokemonList() {
  const [data, setData]       = useState<PokemonBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pokemon`);
        if (!res.ok) throw new Error('Error al obtener la lista');
        setData(await res.json());
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
}

export function usePokemonDetail(name: string | null) {
  const [data, setData]       = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;
    setData(null);
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pokemon/${name}`);
        if (!res.ok) throw new Error('Pokémon no encontrado');
        setData(await res.json());
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    })();
  }, [name]);

  return { data, loading, error };
}

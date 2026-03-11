'use client';
import { useState } from 'react';
import { usePokemonList, usePokemonDetail, PokemonDetail } from './hooks/usePokemon';
import PokemonCard from './components/PokemonCard';
import PokemonModal from './components/PokemonModal';

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-gray-200 animate-pulse min-h-72 p-5 flex flex-col gap-3">
      <div className="h-4 bg-gray-300 rounded w-1/3" />
      <div className="h-5 bg-gray-300 rounded w-1/2" />
      <div className="flex-1 bg-gray-300 rounded-xl mt-2" />
      <div className="h-3 bg-gray-300 rounded w-2/3" />
    </div>
  );
}

function CardLoader({ name, onClick }: { name: string; onClick: (d: PokemonDetail) => void }) {
  const { data, loading } = usePokemonDetail(name);
  if (loading) return <SkeletonCard />;
  if (!data) return null;
  return <PokemonCard pokemon={data} onClick={() => onClick(data)} />;
}

export default function Home() {
  const { data: list, loading: listLoading, error: listError } = usePokemonList();
  const [modal, setModal]     = useState<PokemonDetail | null>(null);
  const [search, setSearch]   = useState('');
  const [query, setQuery]     = useState('');
  const { data: searchResult, loading: searchLoading, error: searchError } = usePokemonDetail(query || null);

  const handleSearch = () => {
    const val = search.trim().toLowerCase();
    if (val) setQuery(val);
  };

  return (
    <>
      {/* TYPE GRADIENT STYLES */}
      <style>{`
        .type-grass    { background: linear-gradient(180deg,#70d55b,#67c34f); }
        .type-poison   { background: linear-gradient(180deg,#9b59b6,#8e44ad); }
        .type-fire     { background: linear-gradient(180deg,#ff9a5a,#ff7a3a); }
        .type-water    { background: linear-gradient(180deg,#5bc0ff,#2b9cff); }
        .type-electric { background: linear-gradient(180deg,#ffd86b,#ffcb3c); }
        .type-normal   { background: linear-gradient(180deg,#bdbdbd,#9e9e9e); }
        .type-psychic  { background: linear-gradient(180deg,#ff7fbf,#f24da6); }
        .type-ice      { background: linear-gradient(180deg,#a7f0ff,#7fe4ff); }
        .type-fighting { background: linear-gradient(180deg,#d06b44,#b94b2a); }
        .type-ground   { background: linear-gradient(180deg,#e0c068,#d4b155); }
        .type-rock     { background: linear-gradient(180deg,#c6b38b,#a88855); }
        .type-bug      { background: linear-gradient(180deg,#9bd66b,#74b843); }
        .type-ghost    { background: linear-gradient(180deg,#6b6bd6,#4b4ba6); }
        .type-dark     { background: linear-gradient(180deg,#6b6b6b,#3b3b3b); }
        .type-dragon   { background: linear-gradient(180deg,#6b9dd6,#4b77b0); }
        .type-steel    { background: linear-gradient(180deg,#c0c8d0,#98a0b0); }
        .type-fairy    { background: linear-gradient(180deg,#ffb1e0,#ff80cc); }
        .type-flying   { background: linear-gradient(180deg,#89c4e1,#6aaed6); }
      `}</style>

      <div className="min-h-screen bg-gray-100 flex flex-col">

        {/* HEADER */}
        <header className="bg-red-500 text-white px-8 py-4 shadow-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">⚡</span>
              <h1 className="text-2xl font-black">Poke666</h1>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <input
                type="search"
                placeholder="Buscar por nombre (ej: pikachu)"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="px-4 py-2 rounded-lg text-gray-800 text-sm outline-none w-64"
              />
              <button
                onClick={handleSearch}
                className="bg-white text-red-500 font-bold px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors"
              >
                Buscar
              </button>
              {query && (
                <button
                  onClick={() => { setQuery(''); setSearch(''); }}
                  className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Ver todos
                </button>
              )}
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">

          {/* Resultado de búsqueda */}
          {query && (
            <div className="mb-8">
              <p className="text-gray-500 text-sm mb-4">
                Resultado para: <strong>{query}</strong>
              </p>
              {searchLoading && (
                <div className="max-w-xs"><SkeletonCard /></div>
              )}
              {searchError && (
                <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-4 max-w-sm">
                  <p className="font-bold">❌ {searchError}</p>
                </div>
              )}
              {searchResult && (
                <div className="max-w-xs">
                  <PokemonCard pokemon={searchResult} onClick={() => setModal(searchResult)} />
                </div>
              )}
            </div>
          )}

          {/* Lista */}
          {!query && (
            <>
              {listLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}
              {listError && (
                <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-6 text-center max-w-sm mx-auto">
                  <p className="text-xl font-bold mb-1">🔌 Error de conexión</p>
                  <p className="text-sm">{listError}</p>
                  <p className="text-xs mt-1 text-red-500">Verifica que el Backend esté corriendo en :3001</p>
                </div>
              )}
              {!listLoading && !listError && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {list.map(p => (
                    <CardLoader key={p.name} name={p.name} onClick={setModal} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        {/* FOOTER */}
        <footer className="bg-red-500 text-white text-center py-4 text-sm">
          © 2025 Pokemon | Datos de la PokeAPI
        </footer>
      </div>

      {/* MODAL */}
      {modal && <PokemonModal pokemon={modal} onClose={() => setModal(null)} />}
    </>
  );
}

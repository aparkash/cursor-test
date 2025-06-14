'use client';

import { useState, useEffect, useRef } from "react";
import { useDebounce } from '../hooks/useDebounce';
import { PokemonCard } from './PokemonCard';
import { Pokemon, PokemonResponse } from '../types/pokemon';

const INITIAL_RESULTS = 8;
const LOAD_MORE_INCREMENT = 4;

export function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [matchingPokemon, setMatchingPokemon] = useState<Array<{ name: string; url: string }>>([]);
  const lastPokemonRef = useRef<HTMLDivElement>(null);
  const debouncedValue = useDebounce(searchValue, 600);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setPokemon([]); // Clear existing Pokemon on new search
  };

  // Initial search to get matching Pokemon
  useEffect(() => {
    const searchPokemon = async () => {
      if (!debouncedValue) {
        setPokemon([]);
        setMatchingPokemon([]);
        setHasMore(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=1000`
        );

        if (!searchResponse.ok) {
          throw new Error('Failed to fetch Pokemon list');
        }

        const searchData: PokemonResponse = await searchResponse.json();
        const searchTerm = debouncedValue.toLowerCase();

        const matches = searchData.results
          .filter(p => p.name.toLowerCase().includes(searchTerm));

        setMatchingPokemon(matches);
        setHasMore(matches.length > INITIAL_RESULTS);
      } catch (error) {
        console.error('Error searching Pokemon:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        setMatchingPokemon([]);
      } finally {
        setLoading(false);
      }
    };

    searchPokemon();
  }, [debouncedValue]);

  // Fetch Pokemon details for current page
  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (matchingPokemon.length === 0) return;

      setLoading(true);
      try {
        const startIndex = 0;
        const endIndex = INITIAL_RESULTS;
        const currentPagePokemon = matchingPokemon.slice(startIndex, endIndex);

        const pokemonDetails = await Promise.all(
          currentPagePokemon.map(async (p) => {
            const response = await fetch(p.url);
            if (!response.ok) {
              throw new Error(`Failed to fetch details for ${p.name}`);
            }
            return response.json();
          })
        );

        setPokemon(pokemonDetails);
        setHasMore(matchingPokemon.length > endIndex);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [matchingPokemon]);

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      const startIndex = pokemon.length;
      const endIndex = startIndex + LOAD_MORE_INCREMENT;
      const nextPagePokemon = matchingPokemon.slice(startIndex, endIndex);

      const newPokemonDetails = await Promise.all(
        nextPagePokemon.map(async (p) => {
          const response = await fetch(p.url);
          if (!response.ok) {
            throw new Error(`Failed to fetch details for ${p.name}`);
          }
          return response.json();
        })
      );

      setPokemon(prev => [...prev, ...newPokemonDetails]);
      setHasMore(matchingPokemon.length > endIndex);

      // Scroll to the last Pokemon from the previous page
      setTimeout(() => {
        lastPokemonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error('Error loading more Pokemon:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pokemon-blue/5 to-pokemon-red/5 dark:from-pokemon-blue/10 dark:to-pokemon-red/10 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-pokemon-blue dark:text-pokemon-blue/90 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)] dark:[text-shadow:_2px_2px_4px_rgb(255_255_255_/_20%)]">
          Pokemon Search
        </h1>

        <div className="relative max-w-md mx-auto mb-8">
          <label htmlFor="pokemon-search" className="sr-only">
            Search for Pokemon
          </label>
          <input
            id="pokemon-search"
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search for a Pokemon..."
            aria-label="Search for Pokemon"
            className="w-full p-3 pl-10 rounded-full border-2 border-pokemon-yellow/30 dark:border-pokemon-yellow/50 focus:border-pokemon-yellow focus:outline-none focus:ring-2 focus:ring-pokemon-yellow/50 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pokemon-yellow dark:text-pokemon-yellow/90" aria-hidden="true">
            🔍
          </div>
        </div>

        <div className="mt-4 space-y-4" role="region" aria-label="Search results">
          {loading && !loadingMore && (
            <div className="text-center py-8" role="status" aria-live="polite">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pokemon-yellow border-t-transparent" aria-hidden="true"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Searching for Pokemon...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8" role="alert">
              <div className="text-6xl mb-4" aria-hidden="true">😢</div>
              <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Try searching for a different Pokemon!</p>
            </div>
          )}

          {!loading && !error && pokemon.length > 0 && (
            <>
              <div
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6"
                role="list"
                aria-label="Pokemon search results"
              >
                {pokemon.map((p, index) => (
                  <div
                    key={p.name}
                    role="listitem"
                    ref={index === pokemon.length - LOAD_MORE_INCREMENT ? lastPokemonRef : null}
                  >
                    <PokemonCard pokemon={p} />
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    aria-label={loadingMore ? "Loading more Pokemon" : "Load more Pokemon"}
                    className="group px-8 py-3 bg-white dark:bg-gray-800 border-2 border-pokemon-yellow text-pokemon-yellow-800 dark:text-pokemon-yellow-200 rounded-full font-semibold text-base shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none focus:outline-none focus:ring-2 focus:ring-pokemon-yellow/50"
                  >
                    {loadingMore ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-pokemon-yellow-800 dark:border-pokemon-yellow-200 border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                        <span>Loading...</span>
                      </span>
                    ) : (
                      'Load More Pokemon'
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {!loading && !error && !searchValue && (
            <div className="text-center py-12" role="status">
              <div className="text-6xl mb-4" aria-hidden="true">🎮</div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Welcome to Pokemon Search!</h2>
              <p className="text-gray-600 dark:text-gray-300">Start typing to search for your favorite Pokemon</p>
            </div>
          )}

          {!loading && !error && searchValue && pokemon.length === 0 && (
            <div className="text-center py-12" role="status">
              <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">No Pokemon Found!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Looks like this Pokemon is still in Professor Oak's lab!</p>
              <div className="max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg shadow-md">
                <p className="text-gray-700 dark:text-gray-200 mb-2">💡 Try searching for:</p>
                <ul className="text-left list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Pikachu (the most famous one!)</li>
                  <li>Charizard (if you're feeling fiery)</li>
                  <li>Bulbasaur (the OG starter)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 
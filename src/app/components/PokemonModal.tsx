import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Pokemon } from '../types/pokemon';
import { Heading } from './Heading';

interface PokemonModalProps {
  pokemon: Pokemon | null;
  onClose: () => void;
  modalPadding?: string;
}

export function PokemonModal({ pokemon, onClose, modalPadding = 'p-6' }: PokemonModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!pokemon) return;
    // Save the last focused element
    lastActiveElement.current = document.activeElement as HTMLElement;
    // Move focus to the close button
    closeButtonRef.current?.focus();

    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    function handleTab(e: KeyboardEvent) {
      if (!modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
    window.addEventListener('keydown', handleEsc);
    window.addEventListener('keydown', handleTab);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('keydown', handleTab);
      // Restore focus to the last active element
      lastActiveElement.current?.focus();
    };
  }, [pokemon, onClose]);

  if (!pokemon) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        ref={modalRef}
        className={`relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full mx-2 ${modalPadding}`}
        onClick={e => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-3xl font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-md hover:bg-red-500 hover:text-white dark:hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-pokemon-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 rounded-full transition"
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-2">
            <Image
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              fill
              className="object-contain"
            />
          </div>
          <Heading as="h2">{pokemon.name}</Heading>
          <div className="flex gap-2 mb-2">
            {pokemon.types.map(t => (
              <span key={t.type.name} className="px-2 py-1 text-xs rounded-full bg-pokemon-yellow/20 dark:bg-pokemon-yellow/30 text-pokemon-yellow-800 dark:text-pokemon-yellow-200 font-semibold">
                {t.type.name}
              </span>
            ))}
          </div>
          <div className="mb-2 text-sm text-gray-700 dark:text-gray-200">
            <span className="mr-4">Height: <b>{pokemon.height / 10}m</b></span>
            <span>Weight: <b>{pokemon.weight / 10}kg</b></span>
          </div>
          <div className="mb-2 text-sm text-gray-700 dark:text-gray-200">
            <span className="font-medium">Abilities:</span>
            <ul className="inline ml-2">
              {pokemon.abilities.map(a => (
                <li key={a.ability.name} className="inline mr-2">
                  {a.ability.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full mt-4">
            <span className="font-medium text-gray-800 dark:text-gray-100">Base Stats:</span>
            <ul className="mt-1">
              {pokemon.stats.map(s => (
                <li key={s.stat.name} className="flex justify-between text-sm text-gray-700 dark:text-gray-200">
                  <span className="capitalize">{s.stat.name}</span>
                  <span className="font-mono">{s.base_stat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
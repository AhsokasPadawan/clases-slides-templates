import { useState } from 'react';
import { Search } from 'lucide-react';
import { searchStudyEntries, SearchableStudyEntry } from '../domain/studySearch';

export interface GlobalSearchBarProps {
  entries: readonly SearchableStudyEntry[];
  onSelectEntry: (entry: SearchableStudyEntry) => void;
  autoFocus?: boolean;
  onClose?: () => void;
}

export function GlobalSearchBar({
  entries,
  onSelectEntry,
  autoFocus = false,
  onClose,
}: GlobalSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const matchingEntries = searchStudyEntries(searchQuery, entries);
  const hasQuery = searchQuery.trim().length > 0;

  const handleSelectEntry = (entry: SearchableStudyEntry) => {
    setSearchQuery('');
    onSelectEntry(entry);
  };

  return (
    <div className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-emerald-600" />
      <input
        type="search"
        autoFocus={autoFocus}
        aria-label="Buscar en la materia"
        placeholder="Buscar algoritmos, conceptos o ejercicios…"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setSearchQuery('');
            onClose?.();
          }
          if (event.key === 'Enter' && matchingEntries.length > 0) {
            handleSelectEntry(matchingEntries[0]);
          }
        }}
        className="w-full rounded-xl border border-emerald-800/20 bg-white py-2.5 pr-3 pl-9 text-sm font-medium text-emerald-950 shadow-lg transition outline-none placeholder:text-emerald-900/40 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-400/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
      />

      {hasQuery && (
        <div
          role="listbox"
          aria-label="Resultados de búsqueda"
          className="animate-fade-slide-in absolute z-30 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-emerald-800/20 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
        >
          {matchingEntries.length === 0 && (
            <p className="px-4 py-3 text-sm text-zinc-500">Sin resultados para “{searchQuery}”.</p>
          )}
          {matchingEntries.map((entry) => (
            <button
              key={`${entry.moduleId}-${entry.anchorId}`}
              type="button"
              role="option"
              aria-selected={false}
              onClick={() => handleSelectEntry(entry)}
              className="flex w-full flex-col items-start px-4 py-2.5 text-left transition hover:bg-emerald-50 dark:hover:bg-zinc-800"
            >
              <span className="text-sm font-semibold text-emerald-950 dark:text-zinc-100">{entry.title}</span>
              <span className="text-xs text-emerald-600">
                {entry.kindLabel} · {entry.moduleLabel}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

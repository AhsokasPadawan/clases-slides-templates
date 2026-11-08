import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchableStudyEntry } from '../domain/studySearch';
import { GlobalSearchBar } from './GlobalSearchBar';

const SYNTHETIC_SEARCH_ENTRIES: readonly SearchableStudyEntry[] = [
  {
    anchorId: 'concept-thermodynamics',
    title: 'Primera Ley de la Termodinámica',
    moduleId: 'unit-1',
    moduleLabel: '1. Energía y Calor',
    kindLabel: 'Concepto',
    searchableText: 'primera ley de la termodinamica conservacion de energia interna calor trabajo',
  },
  {
    anchorId: 'exercise-carnot',
    title: 'Ciclo de Carnot Ideal',
    moduleId: 'unit-practice',
    moduleLabel: '2. Práctica de Laboratorio',
    kindLabel: 'Ejercicio',
    searchableText: 'ciclo de carnot ideal eficiencia termica maquina reversible',
  },
];

describe('GlobalSearchBar', () => {
  it('filters synthetic entries by query and invokes onSelectEntry when an option is clicked', async () => {
    const user = userEvent.setup();
    const onSelectEntry = vi.fn();
    render(
      <GlobalSearchBar
        entries={SYNTHETIC_SEARCH_ENTRIES}
        onSelectEntry={onSelectEntry}
      />,
    );

    await user.type(screen.getByRole('searchbox', { name: /Buscar en la materia/i }), 'carnot');
    await user.click(screen.getByRole('option', { name: /Ciclo de Carnot Ideal/i }));

    expect(onSelectEntry).toHaveBeenCalledTimes(1);
    expect(onSelectEntry).toHaveBeenCalledWith(SYNTHETIC_SEARCH_ENTRIES[1]);
  });

  it('displays an empty state message when no synthetic entry matches the query', async () => {
    const user = userEvent.setup();
    render(
      <GlobalSearchBar
        entries={SYNTHETIC_SEARCH_ENTRIES}
        onSelectEntry={vi.fn()}
      />,
    );

    await user.type(screen.getByRole('searchbox', { name: /Buscar en la materia/i }), 'inexistente');

    expect(screen.getByText(/Sin resultados para “inexistente”/i)).toBeInTheDocument();
  });

  it('selects the first matching entry on Enter and invokes onClose on Escape', async () => {
    const user = userEvent.setup();
    const onSelectEntry = vi.fn();
    const onClose = vi.fn();
    render(
      <GlobalSearchBar
        entries={SYNTHETIC_SEARCH_ENTRIES}
        onSelectEntry={onSelectEntry}
        onClose={onClose}
      />,
    );
    const searchInput = screen.getByRole('searchbox', { name: /Buscar en la materia/i });

    await user.type(searchInput, 'termodinamica{Enter}');
    await user.type(searchInput, 'calor{Escape}');

    expect(onSelectEntry).toHaveBeenCalledWith(SYNTHETIC_SEARCH_ENTRIES[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

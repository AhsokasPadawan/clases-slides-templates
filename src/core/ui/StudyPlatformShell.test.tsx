import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  ConceptSlide,
  ExamExerciseItem,
  ModuleMetadata,
  ModuleSubtopicItem,
} from '../domain/coreTypes';
import { SearchableStudyEntry } from '../domain/studySearch';
import { StudyPlatformShell } from './StudyPlatformShell';

const SYNTHETIC_MODULES: readonly ModuleMetadata[] = [
  {
    id: 'module-0-intro',
    numberLabel: '00',
    sidebarTitle: '0. Introducción General',
    headerTitle: '0. Introducción General',
    subtitle: 'Presentación del curso',
    contractTag: 'Encuadre',
    keyTakeaway: 'Metodología de trabajo.',
  },
  {
    id: 'module-1-core',
    numberLabel: '01',
    sidebarTitle: '1. Sistemas Lineales',
    headerTitle: '1. Sistemas Lineales',
    subtitle: 'Álgebra matricial',
    contractTag: 'Unidad 1',
    keyTakeaway: 'Transformaciones lineales.',
  },
  {
    id: 'module-2-practice',
    numberLabel: '02',
    sidebarTitle: '2. Banco de Problemas',
    headerTitle: '2. Banco de Problemas',
    subtitle: 'Práctica guiada',
    contractTag: 'Práctica',
    keyTakeaway: 'Ejercitación.',
  },
];

const SYNTHETIC_SUBTOPICS: Record<string, readonly ModuleSubtopicItem[]> = {
  'module-0-intro': [
    { id: 'sub-0-1', title: 'Bienvenida', slideId: 'slide-0-1' },
    { id: 'sub-0-2', title: 'Evaluación', slideId: 'slide-0-2' },
  ],
  'module-1-core': [
    { id: 'sub-1-1', title: 'Matrices Inversas', slideId: 'slide-1-1' },
  ],
};

const SYNTHETIC_SLIDES: readonly ConceptSlide[] = [
  {
    id: 'slide-0-1',
    moduleId: 'module-0-intro',
    moduleTitle: '0. Introducción General',
    conceptTitle: 'Bienvenida al Curso',
    conceptSubtitle: 'Apertura',
    badgeLabel: 'Epígrafe',
    slideKind: 'quote',
    partIndex: 1,
    totalParts: 1,
    quoteData: {
      quote: 'El conocimiento se construye resolviendo problemas reales.',
      author: 'Autor Sintético',
    },
  },
  {
    id: 'slide-0-2',
    moduleId: 'module-0-intro',
    moduleTitle: '0. Introducción General',
    conceptTitle: 'Criterios de Evaluación',
    conceptSubtitle: 'Reglas claras',
    badgeLabel: 'Teoría',
    slideKind: 'theory',
    partIndex: 1,
    totalParts: 1,
    theoryData: {
      summary: 'Aprobación mediante entregas prácticas y coloquio integrador.',
      bulletPoints: ['Parcial teórico-práctico.', 'Defensa oral individual.'],
    },
  },
  {
    id: 'slide-1-1',
    moduleId: 'module-1-core',
    moduleTitle: '1. Sistemas Lineales',
    conceptTitle: 'Teorema de Rouché-Frobenius',
    conceptSubtitle: 'Compatibilidad de Sistemas',
    badgeLabel: 'Teoría',
    slideKind: 'theory',
    partIndex: 1,
    totalParts: 1,
    theoryData: {
      summary: 'Un sistema lineal es compatible si el rango de la matriz coincide con el de la ampliada.',
      bulletPoints: ['Determinado cuando el rango iguala al número de incógnitas.'],
    },
  },
];

const SYNTHETIC_EXERCISES: readonly ExamExerciseItem[] = [
  {
    id: 'ex-gauss',
    number: 1,
    title: 'Eliminación Gaussiana con Pivoteo',
    paradigm: 'Álgebra Lineal',
    difficultyLabel: 'Media',
    targetComplexityLatex: 'O(n^3)',
    problemStatement: 'Triangular la matriz ampliada mediante operaciones elementales de fila.',
    inputOutputExample: 'Matriz 3x3 -> Solución única x=(1, 2, 3)',
  },
];

const SYNTHETIC_SEARCH_INDEX: readonly SearchableStudyEntry[] = [
  {
    anchorId: 'slide-1-1',
    title: 'Teorema de Rouché-Frobenius',
    moduleId: 'module-1-core',
    moduleLabel: '1. Sistemas Lineales',
    kindLabel: 'Concepto',
    searchableText: 'teorema de rouche frobenius compatibilidad rango matriz',
  },
  {
    anchorId: 'ex-gauss',
    title: 'Eliminación Gaussiana con Pivoteo',
    moduleId: 'module-2-practice',
    moduleLabel: '2. Banco de Problemas',
    kindLabel: 'Ejercicio',
    searchableText: 'eliminacion gaussiana con pivoteo matriz ampliada',
  },
];

beforeEach(() => {
  localStorage.clear();
});

function renderSyntheticShell() {
  return render(
    <StudyPlatformShell
      courseTitle="Álgebra Lineal Computacional"
      courseDepartment="Ciencias Exactas"
      modules={SYNTHETIC_MODULES}
      subtopicsByModuleId={SYNTHETIC_SUBTOPICS}
      slides={SYNTHETIC_SLIDES}
      exercises={SYNTHETIC_EXERCISES}
      searchIndex={SYNTHETIC_SEARCH_INDEX}
      trackableItemIds={['module-0-intro', 'module-1-core', 'ex-gauss']}
      practiceModuleId="module-2-practice"
      practiceHeadingTitle="Banco de Problemas de Examen"
    />,
  );
}

describe('StudyPlatformShell', () => {
  it('navigates across slides and modules via buttons, keyboard arrows, and sidebar items', async () => {
    const user = userEvent.setup();
    const { container } = renderSyntheticShell();
    const shellRoot = container.firstElementChild as HTMLElement;

    expect(screen.getByRole('heading', { name: /Bienvenida al Curso/i })).toBeInTheDocument();

    shellRoot.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('heading', { name: /Criterios de Evaluación/i })).toBeInTheDocument();

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('heading', { name: /Bienvenida al Curso/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /1\. Sistemas Lineales/i }));
    expect(screen.getByRole('heading', { name: /Teorema de Rouché-Frobenius/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /2\. Banco de Problemas/i }));
    expect(screen.getByRole('heading', { name: /Banco de Problemas de Examen/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Eliminación Gaussiana con Pivoteo/i })).toBeInTheDocument();
  });

  it('opens global search modal, jumps to theory or practice items, and persists preferences', async () => {
    const user = userEvent.setup();
    const { unmount } = renderSyntheticShell();

    await user.click(screen.getByRole('button', { name: /Abrir buscador/i }));
    await user.type(screen.getByRole('searchbox', { name: /Buscar en la materia/i }), 'gaussiana');
    await user.click(screen.getByRole('option', { name: /Eliminación Gaussiana con Pivoteo/i }));

    expect(screen.getByRole('heading', { name: /Eliminación Gaussiana con Pivoteo/i })).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /Marcar ejercicio Eliminación Gaussiana con Pivoteo como practicado/i,
      }),
    );
    await user.click(screen.getByRole('button', { name: /Activar modo nocturno/i }));
    await user.click(screen.getByRole('button', { name: /Colapsar barra lateral/i }));

    unmount();
    renderSyntheticShell();

    expect(screen.getByRole('button', { name: /Expandir barra lateral/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Activar modo claro/i })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: /Progreso de repaso/i })).toHaveAttribute('aria-valuenow', '33');
  });

  it('opens and closes mobile navigation drawer and navigates to selected module', async () => {
    const user = userEvent.setup();
    renderSyntheticShell();

    expect(screen.queryByRole('dialog', { name: /Navegación del curso/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Abrir menú de navegación/i }));
    expect(screen.getByRole('dialog', { name: /Navegación del curso/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Cerrar menú de navegación/i }));
    expect(screen.queryByRole('dialog', { name: /Navegación del curso/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Abrir menú de navegación/i }));
    const drawer = screen.getByRole('dialog', { name: /Navegación del curso/i });
    const moduleButton = drawer.querySelector('button[aria-label="1. Sistemas Lineales"]');
    expect(moduleButton).toBeInTheDocument();
    if (moduleButton) await user.click(moduleButton);

    expect(screen.getByRole('heading', { name: /Teorema de Rouché-Frobenius/i })).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: /Navegación del curso/i })).not.toBeInTheDocument();
  });

  it('renders all module slides vertically in mobile mode without requiring next button', async () => {
    const user = userEvent.setup();
    const originalWidth = window.innerWidth;
    act(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));
    });

    try {
      renderSyntheticShell();

      expect(screen.getByRole('heading', { name: /Bienvenida al Curso/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Criterios de Evaluación/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Diapositiva siguiente/i })).not.toBeInTheDocument();

      const nextModuleButton = screen.getByRole('button', { name: /Continuar a 1\. Sistemas Lineales/i });
      expect(nextModuleButton).toBeInTheDocument();
      await user.click(nextModuleButton);

      expect(screen.getByRole('heading', { name: /Teorema de Rouché-Frobenius/i })).toBeInTheDocument();
    } finally {
      act(() => {
        window.innerWidth = originalWidth;
        window.dispatchEvent(new Event('resize'));
      });
    }
  });
});

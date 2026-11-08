import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ExamExerciseItem } from '../domain/coreTypes';
import { ExamPracticeView } from './practice/ExamPracticeView';

const SYNTHETIC_EXERCISES: readonly ExamExerciseItem[] = [
  {
    id: 'ex-1-optics',
    number: 1,
    title: 'Refracción en Lente Convergente',
    paradigm: 'Óptica Geométrica',
    difficultyLabel: 'Media',
    targetComplexityLatex: 'O(1)',
    sourceOrigin: 'Parcial',
    problemStatement: 'Calcular la distancia focal dada la curvatura del lente.',
    inputOutputExample: 'Entrada: R=10cm -> Salida: f=20cm',
    conceptualStrategy: {
      invariantAndIntuition: 'Aplicar la ecuación del fabricante de lentes.',
      keySteps: ['Determinar radios', 'Sustituir índice de refracción'],
      recurrenceOrTransitionLatex: '\\frac{1}{f} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)',
    },
  },
  {
    id: 'ex-2-waves',
    number: 2,
    title: 'Interferencia en Doble Rendija',
    paradigm: 'Ondas',
    difficultyLabel: 'Alta',
    targetComplexityLatex: 'O(n)',
    sourceOrigin: 'Diapositivas',
    problemStatement: 'Determinar la distancia entre máximos de interferencia.',
    inputOutputExample: 'Entrada: d=0.1mm -> Salida: y=5mm',
  },
];

beforeEach(() => {
  localStorage.clear();
});

describe('ExamPracticeView', () => {
  it('renders exercise statement, persists workspace drafts in localStorage, and switches to the whiteboard tab', async () => {
    const user = userEvent.setup();
    const onSelectExercise = vi.fn();
    const onToggleCompletedItem = vi.fn();
    const { unmount } = render(
      <ExamPracticeView
        exercises={SYNTHETIC_EXERCISES}
        completedItemIds={[]}
        selectedExerciseId="ex-1-optics"
        onSelectExercise={onSelectExercise}
        onToggleCompletedItem={onToggleCompletedItem}
      />,
    );

    const pseudocodeTextarea = screen.getByRole('textbox', {
      name: /Área de pseudocódigo para Refracción en Lente Convergente/i,
    });
    await user.type(pseudocodeTextarea, 'Funcion CalcularFoco(radio)');
    await user.click(screen.getByRole('tab', { name: /^Código$/i }));
    const codeTextarea = screen.getByRole('textbox', {
      name: /Área de código en java para Refracción en Lente Convergente/i,
    });
    await user.type(codeTextarea, 'double f = 20.0;');
    await user.click(screen.getByRole('tab', { name: /^Pizarrón$/i }));
    const toolbar = screen.getByRole('toolbar', { name: /Herramientas de dibujo/i });
    const rectangleButton = within(toolbar).getByRole('button', { name: /Rectángulo/i });
    await user.click(rectangleButton);

    expect(rectangleButton).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('img', {
        name: /Pizarrón para bocetar Refracción en Lente Convergente/i,
      }),
    ).toBeInTheDocument();

    unmount();
    render(
      <ExamPracticeView
        exercises={SYNTHETIC_EXERCISES}
        completedItemIds={[]}
        selectedExerciseId="ex-1-optics"
        onSelectExercise={onSelectExercise}
        onToggleCompletedItem={onToggleCompletedItem}
      />,
    );

    expect(
      screen.getByRole('textbox', {
        name: /Área de pseudocódigo para Refracción en Lente Convergente/i,
      }),
    ).toHaveValue('Funcion CalcularFoco(radio)');
  });

  it('toggles solution strategy accordion, switches exercises via selector, and marks exercise as practiced', async () => {
    const user = userEvent.setup();
    const onSelectExercise = vi.fn();
    const onToggleCompletedItem = vi.fn();
    render(
      <ExamPracticeView
        exercises={SYNTHETIC_EXERCISES}
        completedItemIds={[]}
        selectedExerciseId="ex-1-optics"
        onSelectExercise={onSelectExercise}
        onToggleCompletedItem={onToggleCompletedItem}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Clave Algorítmica y Recurrencia/i }));
    await user.click(
      screen.getByRole('button', {
        name: /Marcar ejercicio Refracción en Lente Convergente como practicado/i,
      }),
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: /Seleccionar ejercicio de práctica/i }),
      'ex-2-waves',
    );

    expect(screen.getByText(/Aplicar la ecuación del fabricante de lentes/i)).toBeInTheDocument();
    expect(onToggleCompletedItem).toHaveBeenCalledWith('ex-1-optics');
    expect(onSelectExercise).toHaveBeenCalledWith('ex-2-waves');
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ConceptSlide } from '../domain/coreTypes';
import { SlideBlockRegistry } from './slides/defaultBlockRegistry';
import { PresentationSlideView } from './slides/PresentationSlideView';

const SYNTHETIC_QUOTE_SLIDE: ConceptSlide = {
  id: 'slide-quote-1',
  moduleId: 'module-0',
  moduleTitle: 'Módulo 0: Introducción',
  conceptTitle: 'Pensamiento Científico',
  conceptSubtitle: 'Reflexión Inicial',
  badgeLabel: 'Epígrafe',
  slideKind: 'quote',
  partIndex: 1,
  totalParts: 1,
  quoteData: {
    quote: 'La ciencia es la progresiva aproximación del hombre al mundo real.',
    author: 'Max Planck',
    source: 'Autobiografía Científica',
    pedagogicalContext: 'Comprender los modelos antes de aplicar las fórmulas.',
  },
};

const SYNTHETIC_THEORY_SLIDE: ConceptSlide = {
  id: 'slide-theory-1',
  moduleId: 'module-1',
  moduleTitle: 'Módulo 1: Dinámica',
  conceptTitle: 'Conservación del Momento',
  conceptSubtitle: 'Sistemas Aislados',
  badgeLabel: 'Teoría',
  slideKind: 'theory',
  partIndex: 1,
  totalParts: 2,
  theoryData: {
    summary: 'Principio base: En ausencia de fuerzas externas, el momento lineal total permanece constante.',
    bulletPoints: [
      'Colisión elástica: Se conserva tanto la energía cinética como el momento.',
      'Colisión inelástica: Se conserva el momento pero parte de la energía se disipa.',
    ],
    formulas: [
      {
        label: 'Momento Lineal',
        latex: 'p = m \\cdot v',
        description: 'Producto de la masa por la velocidad.',
      },
    ],
  },
};

describe('PresentationSlideView', () => {
  it('renders universal quote and theory slides with topic-relative numbering and navigation controls', async () => {
    const user = userEvent.setup();
    const onNavigatePrevious = vi.fn();
    const onNavigateNext = vi.fn();
    const { rerender } = render(
      <PresentationSlideView
        slide={SYNTHETIC_QUOTE_SLIDE}
        currentSlideIndex={0}
        totalSlidesCount={3}
        moduleSlideIndex={0}
        moduleSlidesCount={2}
        onNavigatePrevious={onNavigatePrevious}
        onNavigateNext={onNavigateNext}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Diapositiva siguiente/i }));

    expect(screen.getByText('Diapositiva #1')).toBeInTheDocument();
    expect(screen.getByText('Diapositiva 1 / 2')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Pensamiento Científico/i })).toBeInTheDocument();
    expect(screen.getByText(/Max Planck/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Diapositiva anterior/i })).toBeDisabled();
    expect(onNavigateNext).toHaveBeenCalledTimes(1);

    rerender(
      <PresentationSlideView
        slide={SYNTHETIC_THEORY_SLIDE}
        currentSlideIndex={1}
        totalSlidesCount={3}
        moduleSlideIndex={1}
        moduleSlidesCount={2}
        onNavigatePrevious={onNavigatePrevious}
        onNavigateNext={onNavigateNext}
      />,
    );

    expect(screen.getByText('Diapositiva #2')).toBeInTheDocument();
    expect(screen.getByText('Momento Lineal')).toBeInTheDocument();
    expect(screen.getByText(/Colisión elástica:/i)).toBeInTheDocument();
  });

  it('delegates rendering to an injected courseBlockRegistry for subject-specific slide kinds', () => {
    const visualizerSlide: ConceptSlide = {
      id: 'slide-vis-1',
      moduleId: 'module-1',
      moduleTitle: 'Módulo 1: Dinámica',
      conceptTitle: 'Simulador de Péndulo',
      conceptSubtitle: 'Visualización Interactiva',
      badgeLabel: 'Simulador',
      slideKind: 'visualizer',
      partIndex: 1,
      totalParts: 1,
      visualizerId: 'pendulum-sim',
    };
    const customRegistry: SlideBlockRegistry = {
      visualizer: ({ slide }) => (
        <div data-testid="custom-visualizer">Renderizando: {slide.visualizerId}</div>
      ),
    };

    render(
      <PresentationSlideView
        slide={visualizerSlide}
        currentSlideIndex={0}
        totalSlidesCount={1}
        moduleSlideIndex={0}
        moduleSlidesCount={1}
        courseBlockRegistry={customRegistry}
        onNavigatePrevious={vi.fn()}
        onNavigateNext={vi.fn()}
      />,
    );

    expect(screen.getByTestId('custom-visualizer')).toHaveTextContent('Renderizando: pendulum-sim');
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ModuleMetadata, ModuleSubtopicItem } from '../domain/coreTypes';
import { StudySidebar } from './sidebar/StudySidebar';

const SYNTHETIC_MODULES: readonly ModuleMetadata[] = [
  {
    id: 'module-1-intro',
    numberLabel: '01',
    sidebarTitle: '1. Fundamentos del Curso',
    headerTitle: 'Fundamentos del Curso',
    subtitle: 'Introducción general',
    contractTag: 'Unidad 1',
    keyTakeaway: 'Conceptos base.',
  },
  {
    id: 'module-2-practice',
    numberLabel: '02',
    sidebarTitle: '2. Práctica Integradora',
    headerTitle: 'Práctica Integradora',
    subtitle: 'Ejercicios de aplicación',
    contractTag: 'Práctica',
    keyTakeaway: 'Resolución práctica.',
  },
];

const SYNTHETIC_SUBTOPICS: Record<string, readonly ModuleSubtopicItem[]> = {
  'module-1-intro': [
    { id: 'sub-1', title: 'Axiomas Iniciales', slideId: 'slide-1' },
    { id: 'sub-2', title: 'Propiedades Derivadas', slideId: 'slide-2' },
  ],
  'module-2-practice': [
    { id: 'sub-p1', title: 'Casos de Estudio', paradigm: 'Estudio' },
  ],
};

describe('StudySidebar', () => {
  it('renders course metadata, header actions, theory and practice modules, and subtopics', async () => {
    const user = userEvent.setup();
    const onSelectSubtopic = vi.fn();
    render(
      <StudySidebar
        modules={SYNTHETIC_MODULES}
        subtopicsByModuleId={SYNTHETIC_SUBTOPICS}
        practiceModuleId="module-2-practice"
        courseTitle="Física Experimental I"
        courseDepartment="Licenciatura · Ciencias"
        activeModuleId="module-1-intro"
        activeSlideId="slide-1"
        completedItemIds={['module-1-intro']}
        progressPercentage={50}
        themeMode="emerald-light"
        isCollapsed={false}
        onSelectModule={vi.fn()}
        onSelectSubtopic={onSelectSubtopic}
        onToggleTheme={vi.fn()}
        onToggleCollapse={vi.fn()}
        onOpenSearch={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Propiedades Derivadas/i }));

    expect(screen.getByText('Física Experimental I')).toBeInTheDocument();
    expect(screen.getByText('Licenciatura · Ciencias')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Abrir buscador/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Activar modo nocturno/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Colapsar barra lateral/i })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: /Progreso de repaso/i })).toHaveAttribute('aria-valuenow', '50');
    expect(onSelectSubtopic).toHaveBeenCalledWith('module-1-intro', 'slide-2', undefined);
  });

  it('renders the compact rail when collapsed and triggers expand and module selection callbacks', async () => {
    const user = userEvent.setup();
    const onSelectModule = vi.fn();
    const onToggleCollapse = vi.fn();
    render(
      <StudySidebar
        modules={SYNTHETIC_MODULES}
        subtopicsByModuleId={SYNTHETIC_SUBTOPICS}
        practiceModuleId="module-2-practice"
        activeModuleId="module-1-intro"
        completedItemIds={[]}
        progressPercentage={25}
        themeMode="emerald-night"
        isCollapsed={true}
        onSelectModule={onSelectModule}
        onToggleTheme={vi.fn()}
        onToggleCollapse={onToggleCollapse}
        onOpenSearch={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: /2\. Práctica Integradora/i }));
    await user.click(screen.getByRole('button', { name: /Expandir barra lateral/i }));

    expect(onSelectModule).toHaveBeenCalledWith('module-2-practice');
    expect(onToggleCollapse).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /Activar modo claro/i })).toBeInTheDocument();
  });
});

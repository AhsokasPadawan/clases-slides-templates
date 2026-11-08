import { Moon, PanelLeftOpen, Search, Sun } from 'lucide-react';
import { ModuleId, ModuleMetadata } from '../../domain/coreTypes';
import { SECTION_THEMES } from '../../domain/sectionThemes';

export interface SidebarCollapsedRailProps {
  theoryModules: readonly ModuleMetadata[];
  practiceModule?: ModuleMetadata;
  activeModuleId: ModuleId;
  completedItemIds: readonly string[];
  progressPercentage: number;
  isNight: boolean;
  onSelectModule: (moduleId: ModuleId) => void;
  onToggleCollapse: () => void;
  onOpenSearch: () => void;
  onToggleTheme: () => void;
}

export function SidebarCollapsedRail({
  theoryModules,
  practiceModule,
  activeModuleId,
  completedItemIds,
  progressPercentage,
  isNight,
  onSelectModule,
  onToggleCollapse,
  onOpenSearch,
  onToggleTheme,
}: SidebarCollapsedRailProps) {
  return (
    <div className="flex h-full w-16 flex-col items-center justify-between border-r border-zinc-200 bg-zinc-100 py-4 px-2 text-zinc-800 transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Expandir barra lateral"
          title="Expandir barra lateral"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-300 bg-white text-zinc-700 transition hover:bg-zinc-200/70 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-col items-center gap-2" aria-label="Módulos de la materia">
        {theoryModules.map((moduleItem) => {
          const isActive = moduleItem.id === activeModuleId;
          const isCompleted = completedItemIds.includes(moduleItem.id);
          const theme = SECTION_THEMES[moduleItem.id];
          return (
            <button
              key={moduleItem.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              aria-label={moduleItem.sidebarTitle}
              title={moduleItem.sidebarTitle}
              onClick={() => onSelectModule(moduleItem.id)}
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition ${
                isActive
                  ? theme.sidebarRailActiveClass
                  : 'text-zinc-700 hover:bg-zinc-200/70 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white'
              }`}
            >
              <span>{moduleItem.numberLabel}</span>
              {isCompleted && (
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-zinc-100 dark:ring-zinc-950"
                />
              )}
            </button>
          );
        })}

        {practiceModule && (
          <>
            <div className="my-1 h-px w-8 bg-zinc-300 dark:bg-zinc-800" />
            <button
              type="button"
              aria-current={practiceModule.id === activeModuleId ? 'page' : undefined}
              aria-label={practiceModule.sidebarTitle}
              title={`Práctica: ${practiceModule.sidebarTitle}`}
              onClick={() => onSelectModule(practiceModule.id)}
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition ${
                practiceModule.id === activeModuleId
                  ? SECTION_THEMES[practiceModule.id].sidebarRailActiveClass
                  : 'text-fuchsia-800 border border-fuchsia-300 bg-white hover:bg-fuchsia-50 dark:text-fuchsia-200 dark:border-fuchsia-400/40 dark:bg-fuchsia-500/15 dark:hover:bg-fuchsia-500/30'
              }`}
            >
              <span>{practiceModule.numberLabel}</span>
              {completedItemIds.includes(practiceModule.id) && (
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-zinc-100 dark:ring-zinc-950"
                />
              )}
            </button>
          </>
        )}
      </nav>

      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Abrir buscador"
          title="Buscar en la materia"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-300 bg-white text-zinc-700 transition hover:bg-zinc-200/70 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <Search className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isNight ? 'Activar modo claro' : 'Activar modo nocturno'}
          title={isNight ? 'Cambiar a modo claro' : 'Cambiar a modo nocturno'}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-300 bg-white text-zinc-700 transition hover:bg-zinc-200/70 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          {isNight ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>

        <div
          role="progressbar"
          aria-label="Progreso de repaso"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
          title={`Progreso de repaso: ${progressPercentage}%`}
          className="flex h-8 w-10 items-center justify-center rounded-lg border border-zinc-300 bg-white text-[11px] font-bold text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
        >
          {progressPercentage}%
        </div>
      </div>
    </div>
  );
}

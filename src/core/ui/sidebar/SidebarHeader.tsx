import { GraduationCap, Moon, PanelLeftClose, Search, Sun, X } from 'lucide-react';
import { SectionTheme } from '../../domain/sectionThemes';

export interface SidebarHeaderProps {
  courseDepartment: string;
  courseTitle: string;
  activeTheme: SectionTheme;
  isNight: boolean;
  onOpenSearch: () => void;
  onToggleTheme: () => void;
  onToggleCollapse: () => void;
  onCloseDrawer?: () => void;
}

export function SidebarHeader({
  courseDepartment,
  courseTitle,
  activeTheme,
  isNight,
  onOpenSearch,
  onToggleTheme,
  onToggleCollapse,
  onCloseDrawer,
}: SidebarHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs ${activeTheme.sidebarActiveClass}`}
        >
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase truncate dark:text-zinc-400">
            {courseDepartment}
          </p>
          <p className="text-sm font-extrabold text-zinc-900 leading-snug dark:text-white">
            {courseTitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Abrir buscador"
          title="Buscar en la materia"
          className="flex h-9 w-full items-center justify-center rounded-xl border border-zinc-300 bg-white text-zinc-700 transition hover:bg-zinc-200/70 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <Search className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isNight ? 'Activar modo claro' : 'Activar modo nocturno'}
          title={isNight ? 'Cambiar a modo claro' : 'Cambiar a modo nocturno'}
          className="flex h-9 w-full items-center justify-center rounded-xl border border-zinc-300 bg-white text-zinc-700 transition hover:bg-zinc-200/70 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          {isNight ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>

        {onCloseDrawer ? (
          <button
            type="button"
            onClick={onCloseDrawer}
            aria-label="Cerrar menú de navegación"
            title="Cerrar menú de navegación"
            className="flex h-9 w-full items-center justify-center rounded-xl border border-zinc-300 bg-white text-zinc-700 transition hover:bg-zinc-200/70 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Colapsar barra lateral"
            title="Colapsar barra lateral"
            className="flex h-9 w-full items-center justify-center rounded-xl border border-zinc-300 bg-white text-zinc-700 transition hover:bg-zinc-200/70 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

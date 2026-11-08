import { useState } from 'react';
import {
  ExamParadigmCategory,
  ModuleId,
  ModuleMetadata,
  ModuleSubtopicItem,
  ThemeMode,
} from '../../domain/coreTypes';
import { SECTION_THEMES } from '../../domain/sectionThemes';
import { SidebarCollapsedRail } from './SidebarCollapsedRail';
import { SidebarHeader } from './SidebarHeader';
import { SidebarModuleAccordion } from './SidebarModuleAccordion';
import { SidebarProgressCard } from './SidebarProgressCard';

export interface StudySidebarProps {
  modules: readonly ModuleMetadata[];
  subtopicsByModuleId?: Record<ModuleId, readonly ModuleSubtopicItem[]>;
  practiceModuleId?: ModuleId;
  courseTitle?: string;
  courseDepartment?: string;
  activeModuleId: ModuleId;
  activeSlideId?: string;
  activeSubtopicId?: string;
  activeExerciseParadigm?: ExamParadigmCategory;
  completedItemIds: string[];
  progressPercentage: number;
  themeMode: ThemeMode;
  isCollapsed: boolean;
  onSelectModule: (moduleId: ModuleId) => void;
  onSelectSubtopic?: (
    moduleId: ModuleId,
    slideId?: string,
    paradigm?: ExamParadigmCategory,
  ) => void;
  onToggleTheme: () => void;
  onToggleCollapse: () => void;
  onOpenSearch: () => void;
  onCloseDrawer?: () => void;
}

export function StudySidebar({
  modules,
  subtopicsByModuleId = {},
  practiceModuleId,
  courseTitle = 'Plataforma de Estudio',
  courseDepartment = 'Grado · Ingeniería',
  activeModuleId,
  activeSlideId,
  activeSubtopicId,
  activeExerciseParadigm,
  completedItemIds,
  progressPercentage,
  themeMode,
  isCollapsed,
  onSelectModule,
  onSelectSubtopic,
  onToggleTheme,
  onToggleCollapse,
  onOpenSearch,
  onCloseDrawer,
}: StudySidebarProps) {
  const [prevActiveModuleId, setPrevActiveModuleId] = useState<ModuleId>(activeModuleId);
  const [openModuleId, setOpenModuleId] = useState<ModuleId | null>(activeModuleId);

  if (prevActiveModuleId !== activeModuleId) {
    setPrevActiveModuleId(activeModuleId);
    setOpenModuleId(activeModuleId);
  }

  const isNight = themeMode === 'emerald-night';
  const activeTheme = SECTION_THEMES[activeModuleId];
  const theoryModules = practiceModuleId
    ? modules.filter((moduleItem) => moduleItem.id !== practiceModuleId)
    : modules;
  const practiceModule = practiceModuleId
    ? modules.find((moduleItem) => moduleItem.id === practiceModuleId)
    : undefined;

  const handleToggleModuleAccordion = (moduleId: ModuleId) => {
    if (activeModuleId !== moduleId) {
      onSelectModule(moduleId);
      setOpenModuleId(moduleId);
    } else {
      setOpenModuleId((prev) => (prev === moduleId ? null : moduleId));
    }
  };

  const handleSubtopicClick = (moduleId: ModuleId, subtopic: ModuleSubtopicItem) => {
    if (onSelectSubtopic) {
      onSelectSubtopic(moduleId, subtopic.slideId, subtopic.paradigm);
    } else {
      onSelectModule(moduleId);
    }
  };

  if (isCollapsed) {
    return (
      <SidebarCollapsedRail
        theoryModules={theoryModules}
        practiceModule={practiceModule}
        activeModuleId={activeModuleId}
        completedItemIds={completedItemIds}
        progressPercentage={progressPercentage}
        isNight={isNight}
        onSelectModule={onSelectModule}
        onToggleCollapse={onToggleCollapse}
        onOpenSearch={onOpenSearch}
        onToggleTheme={onToggleTheme}
      />
    );
  }

  return (
    <div className="flex h-full w-full md:w-72 flex-col gap-4 border-r border-zinc-200 bg-zinc-100 p-4 text-zinc-800 transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
      <SidebarHeader
        courseDepartment={courseDepartment}
        courseTitle={courseTitle}
        activeTheme={activeTheme}
        isNight={isNight}
        onOpenSearch={onOpenSearch}
        onToggleTheme={onToggleTheme}
        onToggleCollapse={onToggleCollapse}
        onCloseDrawer={onCloseDrawer}
      />

      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
        <div>
          <p className="px-2 pb-1.5 text-[10px] font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
            Teoría
          </p>
          <nav className="space-y-1" aria-label="Módulos teóricos">
            {theoryModules.map((moduleItem) => (
              <SidebarModuleAccordion
                key={moduleItem.id}
                moduleItem={moduleItem}
                subtopics={subtopicsByModuleId[moduleItem.id] ?? []}
                isActive={moduleItem.id === activeModuleId}
                isCompleted={completedItemIds.includes(moduleItem.id)}
                isOpen={openModuleId === moduleItem.id}
                isPracticeModule={false}
                activeSlideId={activeSlideId}
                activeSubtopicId={activeSubtopicId}
                activeExerciseParadigm={activeExerciseParadigm}
                onToggleAccordion={handleToggleModuleAccordion}
                onSelectSubtopic={handleSubtopicClick}
              />
            ))}
          </nav>
        </div>

        {practiceModule && (
          <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">
            <p className="px-2 pb-1.5 text-[10px] font-bold tracking-wider text-fuchsia-700 uppercase dark:text-fuchsia-300">
              Práctica
            </p>
            <nav aria-label="Módulo de práctica">
              <SidebarModuleAccordion
                moduleItem={practiceModule}
                subtopics={subtopicsByModuleId[practiceModule.id] ?? []}
                isActive={practiceModule.id === activeModuleId}
                isCompleted={completedItemIds.includes(practiceModule.id)}
                isOpen={openModuleId === practiceModule.id}
                isPracticeModule={true}
                activeSlideId={activeSlideId}
                activeSubtopicId={activeSubtopicId}
                activeExerciseParadigm={activeExerciseParadigm}
                onToggleAccordion={handleToggleModuleAccordion}
                onSelectSubtopic={handleSubtopicClick}
              />
            </nav>
          </div>
        )}
      </div>

      <SidebarProgressCard
        progressPercentage={progressPercentage}
        activeTheme={activeTheme}
      />
    </div>
  );
}

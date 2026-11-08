import { ChevronDown } from 'lucide-react';
import {
  ExamParadigmCategory,
  ModuleId,
  ModuleMetadata,
  ModuleSubtopicItem,
} from '../../domain/coreTypes';
import { SECTION_THEMES } from '../../domain/sectionThemes';

export interface SidebarModuleAccordionProps {
  moduleItem: ModuleMetadata;
  subtopics: readonly ModuleSubtopicItem[];
  isActive: boolean;
  isCompleted: boolean;
  isOpen: boolean;
  isPracticeModule: boolean;
  activeSlideId?: string;
  activeSubtopicId?: string;
  activeExerciseParadigm?: ExamParadigmCategory;
  onToggleAccordion: (moduleId: ModuleId) => void;
  onSelectSubtopic: (moduleId: ModuleId, subtopic: ModuleSubtopicItem) => void;
}

export function SidebarModuleAccordion({
  moduleItem,
  subtopics,
  isActive,
  isCompleted,
  isOpen,
  isPracticeModule,
  activeSlideId,
  activeSubtopicId,
  activeExerciseParadigm,
  onToggleAccordion,
  onSelectSubtopic,
}: SidebarModuleAccordionProps) {
  const theme = SECTION_THEMES[moduleItem.id];

  return (
    <div className="rounded-xl overflow-hidden transition-colors">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-current={isActive ? 'page' : undefined}
        aria-label={moduleItem.sidebarTitle}
        onClick={() => onToggleAccordion(moduleItem.id)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
          isActive
            ? theme.sidebarActiveClass
            : 'text-zinc-700 hover:bg-zinc-200/70 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 dark:hover:text-white'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            aria-hidden="true"
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${theme.dotClass}`}
          />
          <span className="truncate">{moduleItem.sidebarTitle}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isCompleted && (
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full bg-amber-400"
            />
          )}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && subtopics.length > 0 && (
        <div
          className={`mt-1 ml-3.5 pl-2.5 border-l-2 ${theme.sidebarAccordionBorderClass} flex flex-col gap-0.5 py-1`}
        >
          {subtopics.map((subtopic) => {
            const isSubtopicActive = activeSubtopicId
              ? subtopic.id === activeSubtopicId
              : isPracticeModule
                ? activeExerciseParadigm === subtopic.paradigm
                : subtopic.slideId === activeSlideId;

            return (
              <button
                key={subtopic.id}
                type="button"
                onClick={() => onSelectSubtopic(moduleItem.id, subtopic)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-[11px] transition ${
                  isSubtopicActive
                    ? theme.subtopicActiveClass
                    : theme.subtopicHoverClass
                }`}
              >
                <span className="truncate">{subtopic.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

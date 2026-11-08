import { ReactNode, useRef, useState, useSyncExternalStore } from 'react';
import { ChevronDown, Menu, Moon, Search, Sun } from 'lucide-react';
import {
  ConceptSlide,
  ExamExerciseItem,
  ExamExerciseVisualResource,
  ExamParadigmCategory,
  ModuleId,
  ModuleMetadata,
  ModuleSubtopicItem,
  ThemeMode,
} from '../domain/coreTypes';
import { SECTION_THEMES } from '../domain/sectionThemes';
import {
  loadCompletedItemIds,
  loadSidebarCollapsedPreference,
  loadThemeMode,
  saveCompletedItemIds,
  saveSidebarCollapsedPreference,
  saveThemeMode,
} from '../domain/studyPreferencesStorage';
import { SearchableStudyEntry } from '../domain/studySearch';
import { GlobalSearchBar } from './GlobalSearchBar';
import { ExamPracticeView } from './practice/ExamPracticeView';
import { WorkspaceCodeTokenizer } from './practice/ExerciseWorkspace';
import { PracticeFilterOption } from './practice/PracticeFilterBar';
import {
  calculateStudyProgressPercentage,
  findFirstModuleSlideIndex,
  findMatchingPracticeExercise,
  resolveSearchSelectionTarget,
} from './shellNavigationHelpers';
import { StudySidebar } from './sidebar/StudySidebar';
import { PresentationSlideView } from './slides/PresentationSlideView';
import { SlideBlockRegistry } from './slides/defaultBlockRegistry';

export interface StudyPlatformShellProps {
  courseTitle?: string;
  courseDepartment?: string;
  modules: readonly ModuleMetadata[];
  subtopicsByModuleId?: Record<ModuleId, readonly ModuleSubtopicItem[]>;
  slides: readonly ConceptSlide[];
  exercises?: readonly ExamExerciseItem[];
  searchIndex: readonly SearchableStudyEntry[];
  trackableItemIds: readonly string[];
  practiceModuleId?: ModuleId;
  practiceHeadingTitle?: string;
  paradigmFilters?: readonly PracticeFilterOption[];
  originFilters?: readonly PracticeFilterOption[];
  courseBlockRegistry?: SlideBlockRegistry;
  resolveActiveSubtopicId?: (
    moduleId: ModuleId,
    moduleSlideIds: string[],
    activeSlideId: string,
    activeExerciseParadigm?: string,
  ) => string | undefined;
  matchesPracticeCategory?: (
    exercise: ExamExerciseItem,
    selectedCategory: ExamParadigmCategory,
  ) => boolean;
  renderExerciseVisualResource?: (
    resource: ExamExerciseVisualResource | null | undefined,
    exerciseId: string,
  ) => ReactNode;
  tokenizeCode?: WorkspaceCodeTokenizer;
}

function subscribeViewport(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function getIsMobileSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

function getServerSnapshot(): boolean {
  return false;
}

export function StudyPlatformShell({
  courseTitle,
  courseDepartment,
  modules,
  subtopicsByModuleId = {},
  slides,
  exercises = [],
  searchIndex,
  trackableItemIds,
  practiceModuleId,
  practiceHeadingTitle,
  paradigmFilters,
  originFilters,
  courseBlockRegistry,
  resolveActiveSubtopicId,
  matchesPracticeCategory,
  renderExerciseVisualResource,
  tokenizeCode,
}: StudyPlatformShellProps) {
  const mainScrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useSyncExternalStore(subscribeViewport, getIsMobileSnapshot, getServerSnapshot);
  const initialModuleId = modules[0]?.id ?? slides[0]?.moduleId ?? 'module-0';
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>(initialModuleId);
  const [completedItemIds, setCompletedItemIds] = useState<string[]>(loadCompletedItemIds);
  const [themeMode, setThemeMode] = useState<ThemeMode>(loadThemeMode);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [selectedPracticeExerciseId, setSelectedPracticeExerciseId] = useState<string>(exercises[0]?.id ?? '');
  const [selectedPracticeParadigm, setSelectedPracticeParadigm] = useState<ExamParadigmCategory>('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(loadSidebarCollapsedPreference);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  const currentSlide = slides[currentSlideIndex] ?? slides[0];
  const isExamPracticeActive = Boolean(practiceModuleId && activeModuleId === practiceModuleId && exercises.length > 0);

  const resetMainScrollPosition = () => {
    if (mainScrollContainerRef.current) mainScrollContainerRef.current.scrollTop = 0;
    window.scrollTo?.({ top: 0 });
  };

  const handleNavigateSlide = (targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < slides.length) {
      setCurrentSlideIndex(targetIndex);
      if (slides[targetIndex].moduleId !== activeModuleId) setActiveModuleId(slides[targetIndex].moduleId);
    }
  };

  const slideKeyActions: Record<string, () => void> = {
    ArrowRight: () => handleNavigateSlide(currentSlideIndex + 1),
    ArrowLeft: () => handleNavigateSlide(currentSlideIndex - 1),
  };

  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = themeMode === 'emerald-night' ? 'emerald-light' : 'emerald-night';
    setThemeMode(nextTheme);
    saveThemeMode(nextTheme);
  };

  const handleToggleCollapse = () => {
    const nextCollapsed = !isSidebarCollapsed;
    setIsSidebarCollapsed(nextCollapsed);
    saveSidebarCollapsedPreference(nextCollapsed);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      setIsSearchModalOpen((previous) => !previous);
      return;
    }
    if (isSearchModalOpen) {
      if (event.key === 'Escape') setIsSearchModalOpen(false);
      return;
    }
    if (isMobileDrawerOpen) {
      if (event.key === 'Escape') setIsMobileDrawerOpen(false);
      return;
    }
    const keyAction = slideKeyActions[event.key];
    if (keyAction) {
      event.preventDefault();
      keyAction();
    }
  };

  const handleSelectModule = (moduleId: ModuleId) => {
    setActiveModuleId(moduleId);
    if (moduleId !== practiceModuleId) {
      const firstIndex = findFirstModuleSlideIndex(slides, moduleId);
      if (firstIndex !== -1) setCurrentSlideIndex(firstIndex);
    }
    resetMainScrollPosition();
    setIsMobileDrawerOpen(false);
    if (isMobile) {
      setTimeout(() => {
        if (mainScrollContainerRef.current) {
          mainScrollContainerRef.current.scrollTop = 0;
        }
        const firstModuleSlide = slides.find((slide) => slide.moduleId === moduleId);
        if (firstModuleSlide) {
          document.getElementById(`slide-${firstModuleSlide.id}`)?.scrollIntoView({ behavior: 'instant' });
        }
      }, 0);
    }
  };

  const handleSelectSubtopic = (moduleId: ModuleId, slideId?: string, paradigm?: ExamParadigmCategory) => {
    setActiveModuleId(moduleId);
    if (moduleId === practiceModuleId && paradigm) {
      setSelectedPracticeParadigm(paradigm);
      const match = findMatchingPracticeExercise(exercises, paradigm, matchesPracticeCategory);
      if (match) setSelectedPracticeExerciseId(match.id);
    } else if (slideId) {
      const targetIndex = slides.findIndex((slide) => slide.id === slideId);
      if (targetIndex !== -1) setCurrentSlideIndex(targetIndex);
      if (isMobile) {
        setTimeout(() => {
          document.getElementById(`slide-${slideId}`)?.scrollIntoView({ behavior: 'smooth' });
        }, 30);
      }
    }
    if (!isMobile) resetMainScrollPosition();
    setIsMobileDrawerOpen(false);
  };

  const handleSelectSearchEntry = (entry: SearchableStudyEntry) => {
    setIsSearchModalOpen(false);
    setIsMobileDrawerOpen(false);
    setActiveModuleId(entry.moduleId);
    const { targetSlideIndex, targetExerciseId } = resolveSearchSelectionTarget(entry, slides, exercises, practiceModuleId);
    if (targetExerciseId) setSelectedPracticeExerciseId(targetExerciseId);
    if (targetSlideIndex !== undefined) {
      setCurrentSlideIndex(targetSlideIndex);
      const targetSlide = slides[targetSlideIndex];
      if (isMobile && targetSlide) {
        setTimeout(() => {
          document.getElementById(`slide-${targetSlide.id}`)?.scrollIntoView({ behavior: 'smooth' });
        }, 30);
      }
    }
    if (!isMobile) resetMainScrollPosition();
  };

  const moduleSlides = slides.filter((slide) => slide.moduleId === currentSlide.moduleId);
  const currentModuleSlideIndex = moduleSlides.findIndex((slide) => slide.id === currentSlide.id);
  const currentPracticeExercise = exercises.find((exercise) => exercise.id === selectedPracticeExerciseId);
  const activeSectionTheme = SECTION_THEMES[activeModuleId];
  const currentModuleIndex = modules.findIndex((item) => item.id === activeModuleId);
  const currentModuleMetadata = modules[currentModuleIndex] ?? modules.find((item) => item.id === activeModuleId);
  const nextModule = currentModuleIndex !== -1 && currentModuleIndex < modules.length - 1
    ? modules[currentModuleIndex + 1]
    : undefined;
  const activeHeaderTitle = isExamPracticeActive
    ? (currentModuleMetadata?.headerTitle ?? practiceHeadingTitle ?? 'Taller Práctico')
    : (currentSlide?.moduleTitle ?? currentModuleMetadata?.headerTitle ?? courseTitle);
  const activeHeaderSubtitle = isExamPracticeActive
    ? `${currentModuleMetadata?.contractTag ?? 'Práctica'} · Ejercicio #${currentPracticeExercise?.number ?? 1}`
    : `Diapositiva ${currentSlideIndex + 1} de ${slides.length}`;
  const activeSubtopicId = resolveActiveSubtopicId?.(
    activeModuleId,
    moduleSlides.map((slide) => slide.id),
    currentSlide.id,
    isExamPracticeActive ? currentPracticeExercise?.paradigm : undefined,
  );

  return (
    <div
      data-theme={themeMode}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={`flex flex-col md:flex-row h-screen overflow-hidden ${activeSectionTheme.pageBgClass} text-zinc-900 transition-colors outline-none dark:text-zinc-100`}
    >
      <aside
        className={`hidden md:flex ${
          isSidebarCollapsed ? 'md:w-16' : 'md:w-72'
        } shrink-0 md:h-full md:overflow-hidden transition-all duration-300 ease-in-out`}
      >
        <StudySidebar
          modules={modules}
          subtopicsByModuleId={subtopicsByModuleId}
          practiceModuleId={practiceModuleId}
          courseTitle={courseTitle}
          courseDepartment={courseDepartment}
          activeModuleId={activeModuleId}
          activeSlideId={currentSlide.id}
          activeSubtopicId={activeSubtopicId}
          activeExerciseParadigm={isExamPracticeActive ? currentPracticeExercise?.paradigm : undefined}
          completedItemIds={completedItemIds}
          progressPercentage={calculateStudyProgressPercentage(completedItemIds, trackableItemIds)}
          themeMode={themeMode}
          isCollapsed={isSidebarCollapsed}
          onSelectModule={handleSelectModule}
          onSelectSubtopic={handleSelectSubtopic}
          onToggleTheme={handleToggleTheme}
          onToggleCollapse={handleToggleCollapse}
          onOpenSearch={() => setIsSearchModalOpen(true)}
        />
      </aside>

      {isMobileDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navegación del curso"
          className="fixed inset-0 z-50 flex md:hidden animate-fade-slide-in"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 flex h-full w-80 max-w-[85vw] flex-col overflow-hidden bg-zinc-100 shadow-2xl dark:bg-zinc-950">
            <StudySidebar
              modules={modules}
              subtopicsByModuleId={subtopicsByModuleId}
              practiceModuleId={practiceModuleId}
              courseTitle={courseTitle}
              courseDepartment={courseDepartment}
              activeModuleId={activeModuleId}
              activeSlideId={currentSlide.id}
              activeSubtopicId={activeSubtopicId}
              activeExerciseParadigm={isExamPracticeActive ? currentPracticeExercise?.paradigm : undefined}
              completedItemIds={completedItemIds}
              progressPercentage={calculateStudyProgressPercentage(completedItemIds, trackableItemIds)}
              themeMode={themeMode}
              isCollapsed={false}
              onSelectModule={handleSelectModule}
              onSelectSubtopic={handleSelectSubtopic}
              onToggleTheme={handleToggleTheme}
              onToggleCollapse={() => setIsMobileDrawerOpen(false)}
              onOpenSearch={() => {
                setIsMobileDrawerOpen(false);
                setIsSearchModalOpen(true);
              }}
              onCloseDrawer={() => setIsMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
        <header className="flex md:hidden items-center justify-between border-b border-zinc-200 bg-zinc-100/90 px-3 py-2 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              aria-label="Abrir menú de navegación"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-300 bg-white text-zinc-700 shadow-xs transition active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex flex-col">
              <span className="text-xs font-bold truncate text-zinc-900 dark:text-zinc-100">
                {activeHeaderTitle}
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                {activeHeaderSubtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              aria-label="Buscar contenidos"
              title="Buscar en la materia"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-300 bg-white text-zinc-700 shadow-xs transition active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label={themeMode === 'emerald-night' ? 'Modo claro' : 'Modo nocturno'}
              title={themeMode === 'emerald-night' ? 'Cambiar a modo claro' : 'Cambiar a modo nocturno'}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-300 bg-white text-zinc-700 shadow-xs transition active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {themeMode === 'emerald-night' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </header>

        <main ref={mainScrollContainerRef} className="animate-fade-slide-in flex-1 min-h-0 flex flex-col p-0 overflow-y-auto lg:overflow-hidden">
          {isExamPracticeActive ? (
            <ExamPracticeView
              exercises={exercises}
              completedItemIds={completedItemIds}
              selectedExerciseId={selectedPracticeExerciseId}
              selectedParadigmFilter={selectedPracticeParadigm}
              headingTitle={practiceHeadingTitle}
              practiceModuleId={practiceModuleId}
              paradigmFilters={paradigmFilters}
              originFilters={originFilters}
              matchesCategory={matchesPracticeCategory}
              renderVisualResource={renderExerciseVisualResource}
              tokenizeCode={tokenizeCode}
              onSelectExercise={setSelectedPracticeExerciseId}
              onSelectParadigmFilter={setSelectedPracticeParadigm}
              onToggleCompletedItem={(itemId) => {
                const nextCompleted = completedItemIds.includes(itemId)
                  ? completedItemIds.filter((existingId) => existingId !== itemId)
                  : [...completedItemIds, itemId];
                setCompletedItemIds(nextCompleted);
                saveCompletedItemIds(nextCompleted);
              }}
            />
          ) : isMobile ? (
            <div className="flex flex-col gap-4 p-2.5 sm:p-4 pb-24">
              {moduleSlides.map((moduleSlide, index) => (
                <article
                  key={moduleSlide.id}
                  id={`slide-${moduleSlide.id}`}
                  className="w-full scroll-mt-14 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-xs"
                >
                  <PresentationSlideView
                    slide={moduleSlide}
                    currentSlideIndex={index}
                    totalSlidesCount={slides.length}
                    moduleSlideIndex={index}
                    moduleSlidesCount={moduleSlides.length}
                    courseBlockRegistry={courseBlockRegistry}
                    onNavigatePrevious={() => {}}
                    onNavigateNext={() => {}}
                    isMobileFeed={true}
                  />
                </article>
              ))}

              {nextModule && (
                <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 p-5 text-center bg-zinc-50 dark:bg-zinc-900/50 my-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Fin de este módulo
                  </p>
                  <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">
                    Continuar al siguiente módulo
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSelectModule(nextModule.id)}
                    aria-label={`Continuar a ${nextModule.sidebarTitle}`}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs active:scale-95 transition bg-emerald-600 hover:bg-emerald-500"
                  >
                    <span>Continuar a {nextModule.sidebarTitle}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <PresentationSlideView
              slide={currentSlide}
              currentSlideIndex={currentSlideIndex}
              totalSlidesCount={slides.length}
              moduleSlideIndex={currentModuleSlideIndex !== -1 ? currentModuleSlideIndex : 0}
              moduleSlidesCount={moduleSlides.length}
              courseBlockRegistry={courseBlockRegistry}
              onNavigatePrevious={() => handleNavigateSlide(currentSlideIndex - 1)}
              onNavigateNext={() => handleNavigateSlide(currentSlideIndex + 1)}
            />
          )}
        </main>
      </div>

      {isSearchModalOpen && (
        <div role="dialog" aria-modal="true" aria-label="Buscador de la materia" onClick={() => setIsSearchModalOpen(false)} className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 backdrop-blur-xs animate-fade-slide-in">
          <div className="w-full max-w-xl" onClick={(event) => event.stopPropagation()}>
            <GlobalSearchBar entries={searchIndex} autoFocus onClose={() => setIsSearchModalOpen(false)} onSelectEntry={handleSelectSearchEntry} />
          </div>
        </div>
      )}
    </div>
  );
}

import { ConceptSlide } from '../../domain/coreTypes';
import { SECTION_THEMES, SectionThemeContext } from '../../domain/sectionThemes';
import { defaultBlockRegistry, SlideBlockRegistry } from './defaultBlockRegistry';
import { SlideFooterControls } from './SlideFooterControls';
import { SlideHeader } from './SlideHeader';

export interface PresentationSlideViewProps {
  slide: ConceptSlide;
  currentSlideIndex: number;
  totalSlidesCount: number;
  moduleSlideIndex: number;
  moduleSlidesCount: number;
  courseBlockRegistry?: SlideBlockRegistry;
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
  isMobileFeed?: boolean;
}

export function PresentationSlideView({
  slide,
  currentSlideIndex,
  totalSlidesCount,
  moduleSlideIndex,
  moduleSlidesCount,
  courseBlockRegistry,
  onNavigatePrevious,
  onNavigateNext,
  isMobileFeed,
}: PresentationSlideViewProps) {
  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === totalSlidesCount - 1;
  const isExercise = slide.slideKind === 'exercise' || slide.exerciseItem !== undefined;
  const exerciseNumber = slide.exerciseItem?.number;
  const sectionTheme = SECTION_THEMES[slide.moduleId];
  const mergedBlockRegistry: SlideBlockRegistry = {
    ...defaultBlockRegistry,
    ...courseBlockRegistry,
  };
  const ActiveSlideBlock = mergedBlockRegistry[slide.slideKind];

  return (
    <SectionThemeContext.Provider value={sectionTheme}>
      <div
        tabIndex={0}
        role="region"
        aria-label={`${slide.moduleTitle}: ${slide.conceptTitle}`}
        className="flex h-auto md:h-full w-full flex-col justify-between rounded-none bg-white p-2.5 sm:p-3 md:p-3.5 transition-all outline-none dark:bg-zinc-900 overflow-visible md:overflow-hidden"
      >
        <SlideHeader
          slide={slide}
          moduleSlideIndex={moduleSlideIndex}
          moduleSlidesCount={moduleSlidesCount}
          isExercise={isExercise}
          exerciseNumber={exerciseNumber}
          sectionTheme={sectionTheme}
        />

        <div className="my-2 h-auto flex-initial md:flex-1 md:min-h-0 flex flex-col overflow-visible md:overflow-hidden pr-0.5">
          {ActiveSlideBlock && (
            <ActiveSlideBlock
              slide={slide}
              sectionTheme={sectionTheme}
              isMobileFeed={isMobileFeed}
            />
          )}
        </div>

        <SlideFooterControls
          conceptSubtitle={slide.conceptSubtitle}
          isFirstSlide={isFirstSlide}
          isLastSlide={isLastSlide}
          isExercise={isExercise}
          exerciseNumber={exerciseNumber}
          moduleSlideIndex={moduleSlideIndex}
          moduleSlidesCount={moduleSlidesCount}
          sectionTheme={sectionTheme}
          onNavigatePrevious={onNavigatePrevious}
          onNavigateNext={onNavigateNext}
          isMobileFeed={isMobileFeed}
        />
      </div>
    </SectionThemeContext.Provider>
  );
}

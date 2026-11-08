import { ReactNode } from 'react';
import {
  SlideBlockComponentProps,
  SlideBlockRegistry,
} from '../../core/ui/slides/defaultBlockRegistry';
import { V60ExtractionVisualizer } from '../visualizers/V60ExtractionVisualizer';
import {
  CodeSlideBlock,
  ComplexitySlideBlock,
  CourseExerciseSlideBlock,
} from './CourseSlideBlocks';

export const VISUALIZER_LOOKUP: Record<string, () => ReactNode> = {
  'v60-extraction-simulator': () => <V60ExtractionVisualizer />,
};

function VisualizerSlideBlock({ slide }: SlideBlockComponentProps) {
  if (!slide.visualizerId) return null;
  return (
    <div className="min-h-full flex-1 flex flex-col">
      {VISUALIZER_LOOKUP[slide.visualizerId]?.()}
    </div>
  );
}

export const COURSE_BLOCK_REGISTRY: SlideBlockRegistry = {
  visualizer: VisualizerSlideBlock,
  pseudocode: CodeSlideBlock,
  code: CodeSlideBlock,
  complexity: ComplexitySlideBlock,
  exercise: CourseExerciseSlideBlock,
};

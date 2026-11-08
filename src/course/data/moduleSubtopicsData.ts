import {
  ExamParadigmCategory,
  ModuleId,
  ModuleSubtopicItem,
} from '../../core/domain/coreTypes';
import { resolveActiveSubtopicByConfig } from '../../core/domain/slideDeckBuilder';

export type { ModuleSubtopicItem };

export const MODULE_SUBTOPICS_LOOKUP: Record<ModuleId, ModuleSubtopicItem[]> = {
  'module-1-espresso': [
    {
      id: 'm1-sub-apertura',
      title: 'Apertura: Honoré de Balzac',
      slideId: 'module-1-espresso-apertura-quote',
    },
    {
      id: 'm1-sub-quimica',
      title: 'Presión, Molienda y Crema (9 bar)',
      slideId: 'quimica_y_mecanica_espresso-theory',
    },
    {
      id: 'm1-sub-doppio',
      title: 'Espresso Simple y Doppio (Ratio 1:2)',
      slideId: 'espresso_simple_y_doppio-theory',
    },
    {
      id: 'm1-sub-leche',
      title: 'Macchiato, Flat White y Latte',
      slideId: 'macchiato_flatwhite_latte-theory',
    },
  ],
  'module-2-filtered': [
    {
      id: 'm2-sub-apertura',
      title: 'Apertura: La Serenidad del Filtrado',
      slideId: 'module-2-filtered-apertura-quote',
    },
    {
      id: 'm2-sub-pourover',
      title: 'Hario V60 y Chemex (Goteo)',
      slideId: 'v60_y_chemex-theory',
    },
    {
      id: 'm2-sub-origami',
      title: 'Origami Dripper (20 Pliegues)',
      slideId: 'origami_dripper-theory',
    },
    {
      id: 'm2-sub-inmersion',
      title: 'Prensa Francesa y Aeropress',
      slideId: 'prensa_francesa_y_aeropress-theory',
    },
    {
      id: 'm2-sub-simulador',
      title: 'Simulador Extracción V60',
      slideId: 'simulador_v60-theory',
    },
    {
      id: 'm2-sub-refractometria',
      title: 'Refractometría, TDS y Rendimiento (EY)',
      slideId: 'metricas_refractometria-theory',
    },
  ],
  'module-3-practice': [
    {
      id: 'm3-sub-apertura',
      title: 'Apertura: Scott Rao',
      slideId: 'module-3-practice-apertura-quote',
    },
    {
      id: 'm3-sub-barismo',
      title: 'Calibración y Extracción en Barra',
      paradigm: 'Barismo y Extracción',
    },
  ],
};

export function resolveActiveSubtopicId(
  moduleId: ModuleId,
  moduleSlideIds: string[],
  activeSlideId?: string,
  activeExerciseParadigm?: ExamParadigmCategory,
): string | undefined {
  return resolveActiveSubtopicByConfig({
    subtopics: MODULE_SUBTOPICS_LOOKUP[moduleId] ?? [],
    moduleSlideIds,
    activeSlideId,
    activeExerciseCategory: activeExerciseParadigm,
    isPracticeModule: moduleId === 'module-3-practice',
  });
}

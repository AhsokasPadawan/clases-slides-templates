import rawTheory1Payload from '../../../teoria/teoria_01_espressos.json';
import rawTheory2Payload from '../../../teoria/teoria_02_filtrados.json';
import {
  ConceptSlide,
  ModuleMetadata,
  ModuleStudyData,
} from '../../core/domain/coreTypes';
import { parseRawTheoryModuleData } from '../../core/domain/jsonCourseProcessor';
import {
  buildSlideDeck,
  ModuleOpeningQuoteSpec,
  SlideVisualizerBinding,
} from '../../core/domain/slideDeckBuilder';
import {
  buildStudySearchIndex,
  SearchableStudyEntry,
} from '../../core/domain/studySearch';
import { EXAM_EXERCISES_LIST } from './examExercisesData';

export const MODULE_NAVIGATION_LIST: ModuleMetadata[] = [
  {
    id: 'module-1-espresso',
    numberLabel: '1',
    sidebarTitle: '1. El Universo del Espresso',
    headerTitle: 'Módulo 1: Fundamentos y Clásicos del Espresso',
    subtitle:
      'Extracción a 9 bares, formación de crema, calibración de molienda y recetas de Espresso, Doppio, Macchiato, Flat White y Caffè Latte.',
    contractTag: 'IEspressoExtraction',
    keyTakeaway:
      'La pastilla de café ofrece resistencia hidráulica dinámica: 18 g de café seco a 9 bares deben producir 36 g líquidos en 25-30 segundos.',
  },
  {
    id: 'module-2-filtered',
    numberLabel: '2',
    sidebarTitle: '2. Métodos de Filtrado Manual',
    headerTitle: 'Módulo 2: Filtrados (Pour-Over e Inmersión)',
    subtitle:
      'Hario V60, Chemex, Origami Dripper, Prensa Francesa y Aeropress con refractometría TDS y Extraction Yield.',
    contractTag: 'IFilteredPourOver',
    keyTakeaway:
      'La geometría del cono y el gramaje del filtro definen si la taza prioriza acidez brillante y notas florales o cuerpo denso y untuoso.',
  },
  {
    id: 'module-3-practice',
    numberLabel: '3',
    sidebarTitle: '3. Calibración y Ejercicios',
    headerTitle: 'Taller Práctico de Calibración y Refractometría',
    subtitle:
      'Casos reales de calibración en barra, resolución de canalizaciones, cálculo de Extraction Yield y árboles de decisión.',
    contractTag: 'IBaristaPractice',
    keyTakeaway:
      'Una taza excepcional combina análisis cuantitativo riguroso (balanza, cronómetro y refractometría) con evaluación sensorial balanceada.',
  },
];

const NAVIGATION_METADATA_BY_MODULE_ID: Record<string, ModuleMetadata> = {
  'module-1-espresso': MODULE_NAVIGATION_LIST[0],
  'module-2-filtered': MODULE_NAVIGATION_LIST[1],
};

const THEORY_PAYLOAD_BY_MODULE_ID: Record<string, unknown> = {
  'module-1-espresso': rawTheory1Payload,
  'module-2-filtered': rawTheory2Payload,
};

export const STUDY_MODULES_BY_ID: Record<string, ModuleStudyData> = {
  'module-1-espresso': parseRawTheoryModuleData(
    THEORY_PAYLOAD_BY_MODULE_ID['module-1-espresso'],
    NAVIGATION_METADATA_BY_MODULE_ID['module-1-espresso'],
  ),
  'module-2-filtered': parseRawTheoryModuleData(
    THEORY_PAYLOAD_BY_MODULE_ID['module-2-filtered'],
    NAVIGATION_METADATA_BY_MODULE_ID['module-2-filtered'],
  ),
};

const MODULE_OPENING_QUOTES: Record<string, ModuleOpeningQuoteSpec> = {
  'module-1-espresso': {
    quote:
      'El café llega al estómago y sobreviene una conmoción general: las ideas se ponen en marcha como batallones de un gran ejército en el campo de batalla.',
    author: 'Honoré de Balzac',
    source: 'Tratado de los excitantes modernos (1839)',
    pedagogicalContext:
      'El espresso no es una infusión apresurada, sino la máxima concentración de aceites y volátiles bajo el rigor de la física y la termodinámica.',
    conceptTitle: 'Apertura: El Alma del Espresso',
    conceptSubtitle: 'Honoré de Balzac · Epígrafe',
  },
  'module-2-filtered': {
    quote:
      'El tiempo no se mide en minutos apresurados, sino en la serenidad con que una gota de agua atraviesa la tierra tostada.',
    author: 'Proverbio de Kaffa',
    source: 'Tradición oral de los orígenes del café, Etiopía',
    pedagogicalContext:
      'En el filtrado manual, cada método establece un diálogo diferente entre la gravedad, el lecho de molienda y el papel.',
    conceptTitle: 'Apertura: La Serenidad del Filtrado',
    conceptSubtitle: 'Proverbio Etíope · Epígrafe',
  },
  'module-3-practice': {
    quote:
      'La ciencia mide la luz refractada a través de la taza, pero es el paladar del catador el que reconoce la verdad de la Taza Dorada.',
    author: 'Scott Rao',
    source: "The Professional Barista's Handbook",
    pedagogicalContext:
      'La excelencia en barra une la precisión matemática de la balanza con la sensibilidad sensorial.',
    conceptTitle: 'Apertura: El Ojo y el Paladar del Barista',
    conceptSubtitle: 'Scott Rao · Epígrafe',
  },
};

const CONCEPT_VISUALIZER_MAP: Record<string, SlideVisualizerBinding> = {
  simulador_v60: {
    id: 'v60-extraction-simulator',
    title: 'Simulador Interactivo: Extracción en V60 Paso a Paso',
  },
};

export function buildCourseDeckSlides(): ConceptSlide[] {
  return buildSlideDeck({
    modules: MODULE_NAVIGATION_LIST,
    studyModulesById: STUDY_MODULES_BY_ID,
    moduleOpeningQuotesById: MODULE_OPENING_QUOTES,
    practiceModuleId: 'module-3-practice',
    exercises: EXAM_EXERCISES_LIST,
    conceptVisualizersById: CONCEPT_VISUALIZER_MAP,
  });
}

export const COURSE_SLIDE_DECK: ConceptSlide[] = buildCourseDeckSlides();

export const COURSE_SEARCH_INDEX: SearchableStudyEntry[] = buildStudySearchIndex({
  modules: MODULE_NAVIGATION_LIST,
  studyModulesById: STUDY_MODULES_BY_ID,
  exercises: EXAM_EXERCISES_LIST,
  practiceModuleId: 'module-3-practice',
});

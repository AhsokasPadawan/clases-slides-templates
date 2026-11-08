export type ModuleId = string;

export interface OpeningQuoteData {
  quote: string;
  author: string;
  source?: string;
  pedagogicalContext?: string;
}

export type CodeLanguage = 'pseudocode' | 'java' | 'python';

export type ThemeMode = 'emerald-light' | 'emerald-night';

export type ExamParadigmCategory = string;

export interface CodeSnippetsByLanguage {
  pseudocode: string;
  java: string;
  python: string;
}

export interface CodeComplexityAnnotation {
  startLine: number;
  endLine: number;
  asymptoticCost: string;
  label?: string;
  description?: string;
}

export interface ConceptFormulaItem {
  label: string;
  latex: string;
  description: string;
}

export interface ConceptCardItem {
  id: string;
  title: string;
  badgeText: string;
  summary: string;
  bulletPoints: string[];
  formulas?: ConceptFormulaItem[];
}

export interface AlgorithmShowcaseItem {
  id: string;
  name: string;
  paradigmTag: string;
  bestCaseComplexityLatex: string;
  averageCaseComplexityLatex: string;
  worstCaseComplexityLatex: string;
  spaceComplexityLatex: string;
  recurrenceOrEquationLatex: string;
  keyInsight: string;
  stepByStepSummary: string[];
  codeSnippets: CodeSnippetsByLanguage;
}

export interface ModuleMetadata {
  id: ModuleId;
  numberLabel: string;
  sidebarTitle: string;
  headerTitle: string;
  subtitle: string;
  contractTag: string;
  keyTakeaway: string;
}

export interface ModuleSubtopicItem {
  id: string;
  title: string;
  slideId?: string;
  paradigm?: ExamParadigmCategory;
}

export interface ModuleStudyData {
  metadata: ModuleMetadata;
  concepts: ConceptCardItem[];
  algorithms: AlgorithmShowcaseItem[];
}

export interface ExamExerciseVisualResource {
  tipo: 'latex' | 'svg' | 'markdown_tabla' | 'mermaid';
  formato: string;
  codigo: string;
}

export interface ExamExerciseConceptualStrategy {
  invariantAndIntuition: string;
  keySteps: string[];
  recurrenceOrTransitionLatex: string;
}

export interface ExamExerciseComplexityAnalysis {
  temporalLatex: string;
  spatialLatex: string;
  justification: string;
  theoremApplied: string;
}

export interface ExamExerciseItem {
  id: string;
  number: number;
  title: string;
  paradigm: string;
  difficultyLabel: string;
  targetComplexityLatex: string;
  sourceOrigin?: string;
  problemStatement: string;
  inputOutputExample?: string;
  recursoVisual?: ExamExerciseVisualResource | null;
  conceptualStrategy?: ExamExerciseConceptualStrategy;
  codeSnippets?: CodeSnippetsByLanguage;
  complexityAnalysis?: ExamExerciseComplexityAnalysis;
}

export type SlideKind =
  | 'theory'
  | 'quote'
  | 'visualizer'
  | 'pseudocode'
  | 'code'
  | 'complexity'
  | 'exercise';

export interface ConceptSlide {
  id: string;
  moduleId: ModuleId;
  moduleTitle: string;
  conceptTitle: string;
  conceptSubtitle: string;
  badgeLabel: string;
  slideKind: SlideKind;
  partIndex: number;
  totalParts: number;
  visualizerId?: string;
  exerciseItem?: ExamExerciseItem;
  quoteData?: OpeningQuoteData;
  theoryData?: {
    summary: string;
    bulletPoints?: string[];
    formulas?: ConceptFormulaItem[];
    keyInsight?: string;
    stepByStepSummary?: string[];
    callout?: {
      title: string;
      text: string;
    };
  };
  codeSnippet?: {
    title: string;
    snippets: CodeSnippetsByLanguage;
    preferredLanguage: CodeLanguage;
  };
  complexityData?: {
    temporalLatex: string;
    spatialLatex: string;
    justification: string;
    theoremApplied?: string;
    bestCaseLatex?: string;
    averageCaseLatex?: string;
    worstCaseLatex?: string;
    annotations?: CodeComplexityAnnotation[];
  };
}

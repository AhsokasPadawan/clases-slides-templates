import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import {
  CodeComplexityAnnotation,
  CodeLanguage,
  CodeSnippetsByLanguage,
} from '../../core/domain/coreTypes';
import { SectionTheme } from '../../core/domain/sectionThemes';
import { MathFormula } from '../../core/ui/MathFormula';
import {
  CodeLanguageOption,
  CodeWindowHeaderBar,
  renderHighlightedCodeTokens,
} from './CodeWindowHeaderBar';

export type { CodeComplexityAnnotation };

interface AnnotatedCodeBlockProps {
  title: string;
  snippets: CodeSnippetsByLanguage;
  annotations?: CodeComplexityAnnotation[];
  initialLanguage?: CodeLanguage;
  showAnnotationsDefault?: boolean;
  sectionTheme?: SectionTheme;
}

const ANNOTATED_LANGUAGE_OPTIONS: readonly CodeLanguageOption[] = [
  { id: 'java', label: 'Java', fileExtension: 'Solver.java' },
  { id: 'pseudocode', label: 'Pseudocódigo', fileExtension: '' },
  { id: 'python', label: 'Python', fileExtension: 'solver.py' },
];

type AnnotationBoundaryKind = 'none' | 'single' | 'start' | 'end' | 'middle';

const HIGHLIGHT_STYLING_BY_BOUNDARY: Record<AnnotationBoundaryKind, string> = {
  none: 'bg-transparent',
  single: 'bg-transparent border-2 border-amber-400 rounded-lg shadow-sm',
  start: 'bg-transparent border-t-2 border-l-2 border-r-2 border-amber-400 rounded-t-lg shadow-xs',
  end: 'bg-transparent border-b-2 border-l-2 border-r-2 border-amber-400 rounded-b-lg shadow-xs',
  middle: 'bg-transparent border-l-2 border-r-2 border-amber-400',
};

function resolveAnnotationForLine(
  lineNumber: number,
  annotations: CodeComplexityAnnotation[],
): CodeComplexityAnnotation | undefined {
  return annotations.find(
    (annotation) => lineNumber >= annotation.startLine && lineNumber <= annotation.endLine,
  );
}

function resolveAnnotationBoundaryKind(
  lineNumber: number,
  annotation?: CodeComplexityAnnotation,
): AnnotationBoundaryKind {
  if (!annotation) return 'none';
  const isStart = lineNumber === annotation.startLine;
  const isEnd = lineNumber === annotation.endLine;
  if (isStart && isEnd) return 'single';
  if (isStart) return 'start';
  if (isEnd) return 'end';
  return 'middle';
}

function getCodeBlockContainerClass(lineCount: number): string {
  if (lineCount > 22) {
    return 'p-1.5 sm:p-2 text-[10px] sm:text-[11px] leading-[17px]';
  }
  if (lineCount > 16) {
    return 'p-2 sm:p-2.5 text-[11px] sm:text-xs leading-[18px]';
  }
  return 'p-3 text-xs sm:text-sm leading-relaxed';
}

export function AnnotatedCodeBlock({
  title,
  snippets,
  annotations = [],
  initialLanguage = 'java',
  showAnnotationsDefault = true,
  sectionTheme,
}: AnnotatedCodeBlockProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>(initialLanguage);
  const [isCopied, setIsCopied] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState<boolean>(showAnnotationsDefault);

  const activeCode = snippets[selectedLanguage] || snippets.java || snippets.pseudocode || '';
  const codeLines = activeCode.split(/\r?\n/);

  const handleCopyCode = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(activeCode);
      } catch {
        setIsCopied(true);
      }
    }
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1800);
  };

  const annotationsToggleButton =
    annotations.length > 0 ? (
      <button
        type="button"
        onClick={() => setShowAnnotations((previous) => !previous)}
        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition ${
          showAnnotations
            ? 'border-2 border-amber-400 bg-transparent text-amber-300 shadow-sm'
            : 'border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
        <span>Bloques de Complejidad Asintótica</span>
      </button>
    ) : null;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xl">
      <CodeWindowHeaderBar
        title={title}
        languageOptions={ANNOTATED_LANGUAGE_OPTIONS}
        selectedLanguage={selectedLanguage}
        isCopied={isCopied}
        copyIdleLabel="Copiar"
        copySuccessLabel="Copiado"
        sectionTheme={sectionTheme}
        extraToolbarControl={annotationsToggleButton}
        onSelectLanguage={setSelectedLanguage}
        onCopyCode={handleCopyCode}
      />

      <div
        className={`flex-1 min-h-0 overflow-hidden flex flex-col font-mono ${getCodeBlockContainerClass(
          codeLines.length,
        )}`}
      >
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {codeLines.map((line, index) => {
            const lineNumber = index + 1;
            const currentAnnotation = showAnnotations
              ? resolveAnnotationForLine(lineNumber, annotations)
              : undefined;
            const boundaryKind = resolveAnnotationBoundaryKind(lineNumber, currentAnnotation);
            const highlightClass = HIGHLIGHT_STYLING_BY_BOUNDARY[boundaryKind];
            const isBadgeLine = currentAnnotation && lineNumber === currentAnnotation.startLine;

            return (
              <div
                key={index}
                className={`group relative flex items-stretch px-2 transition-colors ${highlightClass}`}
              >
                <span className="w-8 sm:w-9 shrink-0 select-none pr-2 sm:pr-3 text-right text-xs text-zinc-500 font-mono">
                  {lineNumber}
                </span>

                <span className="min-w-0 flex-1 whitespace-pre py-0.5">
                  {renderHighlightedCodeTokens(line, selectedLanguage)}
                  {line.length === 0 ? '\u00A0' : null}
                </span>

                {isBadgeLine && (
                  <div className="shrink-0 flex items-center pl-2 sm:pl-3 self-center">
                    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-950 px-1.5 py-0.5 text-[11px] sm:text-xs font-black font-mono text-amber-300 shadow-md border-2 border-amber-400">
                      <MathFormula
                        expression={currentAnnotation.asymptoticCost}
                        displayMode={false}
                        className="text-amber-300 font-black"
                      />
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

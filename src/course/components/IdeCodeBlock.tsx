import { useState } from 'react';
import { CodeLanguage, CodeSnippetsByLanguage } from '../../core/domain/coreTypes';
import { SectionTheme } from '../../core/domain/sectionThemes';
import {
  CodeLanguageOption,
  CodeWindowHeaderBar,
  renderHighlightedCodeTokens,
} from './CodeWindowHeaderBar';

interface IdeCodeBlockProps {
  title: string;
  snippets: CodeSnippetsByLanguage;
  initialLanguage?: CodeLanguage;
  sectionTheme?: SectionTheme;
}

const IDE_LANGUAGE_OPTIONS: readonly CodeLanguageOption[] = [
  { id: 'pseudocode', label: 'Pseudocódigo', fileExtension: '' },
  { id: 'java', label: 'Java', fileExtension: 'Solver.java' },
  { id: 'python', label: 'Python', fileExtension: 'solver.py' },
];

export function IdeCodeBlock({
  title,
  snippets,
  initialLanguage = 'pseudocode',
  sectionTheme,
}: IdeCodeBlockProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>(initialLanguage);
  const [isCopied, setIsCopied] = useState(false);

  const activeCode = snippets[selectedLanguage] ?? '';
  const activeOption =
    IDE_LANGUAGE_OPTIONS.find((option) => option.id === selectedLanguage) ??
    IDE_LANGUAGE_OPTIONS[0];
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

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-lg">
      <CodeWindowHeaderBar
        title={title}
        languageOptions={IDE_LANGUAGE_OPTIONS}
        selectedLanguage={selectedLanguage}
        isCopied={isCopied}
        copyIdleLabel="Copiar código"
        copySuccessLabel="¡Copiado!"
        sectionTheme={sectionTheme}
        onSelectLanguage={setSelectedLanguage}
        onCopyCode={handleCopyCode}
      />

      <pre
        aria-label={`Código en ${activeOption.label} para ${title}`}
        className={`flex-1 min-h-0 overflow-auto font-mono ${
          codeLines.length > 20
            ? 'p-2 sm:p-2.5 text-[11px] sm:text-xs leading-5'
            : 'p-4 text-xs leading-relaxed sm:text-sm'
        }`}
      >
        <code className="block min-w-fit">
          {codeLines.map((line, lineIndex) => (
            <div
              key={lineIndex}
              className={`flex ${codeLines.length > 20 ? 'leading-5' : 'leading-6'}`}
            >
              <span className="w-8 sm:w-10 shrink-0 select-none pr-3 sm:pr-4 text-right text-xs text-zinc-600">
                {lineIndex + 1}
              </span>
              <span className="min-w-0 flex-1 whitespace-pre">
                {renderHighlightedCodeTokens(line, selectedLanguage)}
                {line.length === 0 ? '\u00A0' : null}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

import { ReactNode } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { CodeLanguage } from '../../core/domain/coreTypes';
import { SectionTheme } from '../../core/domain/sectionThemes';
import { tokenizeCode } from '../domain/codeSyntaxHighlighter';

export interface CodeLanguageOption {
  id: CodeLanguage;
  label: string;
  fileExtension: string;
}

interface CodeWindowHeaderBarProps {
  title: string;
  languageOptions: readonly CodeLanguageOption[];
  selectedLanguage: CodeLanguage;
  isCopied: boolean;
  copyIdleLabel: string;
  copySuccessLabel: string;
  sectionTheme?: SectionTheme;
  extraToolbarControl?: ReactNode;
  onSelectLanguage: (language: CodeLanguage) => void;
  onCopyCode: () => void;
}

export function renderHighlightedCodeTokens(lineText: string, language: CodeLanguage) {
  const tokens = tokenizeCode(lineText, language);
  return tokens.map((token, index) => (
    <span key={`${index}-${token.text}`} className={token.colorClass}>
      {token.text}
    </span>
  ));
}

export function CodeWindowHeaderBar({
  title,
  languageOptions,
  selectedLanguage,
  isCopied,
  copyIdleLabel,
  copySuccessLabel,
  sectionTheme,
  extraToolbarControl,
  onSelectLanguage,
  onCopyCode,
}: CodeWindowHeaderBarProps) {
  const activeOption =
    languageOptions.find((option) => option.id === selectedLanguage) ?? languageOptions[0];

  const activeTabClass = sectionTheme
    ? `${sectionTheme.primaryButtonClass} shadow-xs`
    : 'bg-emerald-400 text-emerald-950 shadow-xs';
  const terminalIconClass = sectionTheme?.analysisAccentTextClass ?? 'text-emerald-400';
  const copyButtonClass = sectionTheme
    ? `inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${sectionTheme.analysisSubcardClass} ${sectionTheme.analysisAccentTextClass} hover:text-white`
    : 'inline-flex items-center gap-1.5 rounded-xl border border-emerald-800 bg-emerald-950 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:border-emerald-500 hover:bg-emerald-900 hover:text-white';

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <Terminal className={`h-4 w-4 ${terminalIconClass}`} />
        <span className="text-xs sm:text-sm font-semibold text-zinc-200">
          {title}
          {activeOption.fileExtension && (
            <>
              {' '}
              · <span className="text-sky-400 font-mono">{activeOption.fileExtension}</span>
            </>
          )}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {extraToolbarControl}

        <div
          className="inline-flex rounded-xl border border-zinc-800 bg-zinc-950 p-1"
          role="group"
          aria-label="Selector de lenguaje"
        >
          {languageOptions.map((option) => {
            const isSelected = option.id === selectedLanguage;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelectLanguage(option.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  isSelected ? activeTabClass : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <button type="button" onClick={onCopyCode} className={copyButtonClass}>
          {isCopied ? (
            <>
              <Check className={`h-3.5 w-3.5 ${terminalIconClass}`} />
              <span>{copySuccessLabel}</span>
            </>
          ) : (
            <>
              <Copy className={`h-3.5 w-3.5 ${terminalIconClass}`} />
              <span>{copyIdleLabel}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

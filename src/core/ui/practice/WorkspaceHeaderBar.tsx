import { Check, Copy, RotateCcw, Terminal } from 'lucide-react';
import { CodeLanguage } from '../../domain/coreTypes';

export type WorkspaceTab = 'pseudocode' | 'code' | 'whiteboard';
export type CodeTargetLanguage = 'java' | 'python';

export interface WorkspaceHeaderBarProps {
  activeTab: WorkspaceTab;
  codeLanguage: CodeTargetLanguage;
  currentLanguage: CodeLanguage;
  hasContent: boolean;
  copiedStatus: boolean;
  onSelectTab: (tab: WorkspaceTab) => void;
  onSelectCodeLanguage: (language: CodeTargetLanguage) => void;
  onCopyDraft: () => void;
  onClearDraft: () => void;
}

const WORKSPACE_TABS: readonly { id: WorkspaceTab; label: string }[] = [
  { id: 'pseudocode', label: 'Pseudocódigo' },
  { id: 'code', label: 'Código' },
  { id: 'whiteboard', label: 'Pizarrón' },
];

const CODE_LANGUAGES: readonly { id: CodeTargetLanguage; label: string }[] = [
  { id: 'java', label: 'Java' },
  { id: 'python', label: 'Python' },
];

export function WorkspaceHeaderBar({
  activeTab,
  codeLanguage,
  currentLanguage,
  hasContent,
  copiedStatus,
  onSelectTab,
  onSelectCodeLanguage,
  onCopyDraft,
  onClearDraft,
}: WorkspaceHeaderBarProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
      <div className="flex items-center gap-2">
        <Terminal className="h-4 w-4 text-fuchsia-400" />
        <div
          className="inline-flex rounded-xl border border-zinc-800 bg-zinc-950 p-1"
          role="tablist"
          aria-label="Editor de ejercicio"
        >
          {WORKSPACE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-fuchsia-400 text-fuchsia-950 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'code' && (
          <div
            className="inline-flex rounded-xl border border-zinc-800 bg-zinc-900/80 p-0.5"
            role="group"
            aria-label="Lenguaje de código"
          >
            {CODE_LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => onSelectCodeLanguage(lang.id)}
                className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold transition ${
                  codeLanguage === lang.id
                    ? 'bg-fuchsia-400 text-fuchsia-950 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeTab !== 'whiteboard' && (
        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] font-medium text-fuchsia-400 sm:inline">
            Modo: {currentLanguage}
          </span>

          <button
            type="button"
            onClick={onCopyDraft}
            disabled={!hasContent}
            aria-label="Copiar borrador"
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-white disabled:opacity-40"
          >
            {copiedStatus ? (
              <>
                <Check className="h-3 w-3 text-fuchsia-400" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-zinc-400" />
                <span>Copiar</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClearDraft}
            disabled={!hasContent}
            aria-label="Limpiar borrador"
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-zinc-400 transition hover:bg-red-950 hover:text-red-300 disabled:opacity-30"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Limpiar</span>
          </button>
        </div>
      )}
    </div>
  );
}

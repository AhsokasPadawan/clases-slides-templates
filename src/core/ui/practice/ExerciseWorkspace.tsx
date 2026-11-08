import { useRef, useState } from 'react';
import { CodeLanguage } from '../../domain/coreTypes';
import {
  loadExerciseUserDraft,
  saveExerciseUserDraft,
} from '../../domain/studyPreferencesStorage';
import { ExerciseWhiteboard } from './ExerciseWhiteboard';
import {
  CodeTargetLanguage,
  WorkspaceHeaderBar,
  WorkspaceTab,
} from './WorkspaceHeaderBar';

export interface WorkspaceCodeToken {
  text: string;
  colorClass: string;
}

export type WorkspaceCodeTokenizer = (
  sourceCode: string,
  language: CodeLanguage,
) => WorkspaceCodeToken[];

export interface ExerciseWorkspaceProps {
  exerciseId: string;
  exerciseTitle: string;
  tokenizeCode?: WorkspaceCodeTokenizer;
}

const defaultCodeTokenizer: WorkspaceCodeTokenizer = (sourceCode) =>
  sourceCode ? [{ text: sourceCode, colorClass: 'text-zinc-100' }] : [];

function detectCodeLanguage(code: string, currentLanguage: CodeTargetLanguage): CodeTargetLanguage {
  if (/\b(def|elif|lambda|None|True|False)\b/.test(code) && !/\b(public|static|void|class)\b/.test(code)) {
    return 'python';
  }
  if (/\b(public|static|void|System\.out|int\[\]|String)\b/.test(code)) {
    return 'java';
  }
  return currentLanguage;
}

export function ExerciseWorkspace({
  exerciseId,
  exerciseTitle,
  tokenizeCode = defaultCodeTokenizer,
}: ExerciseWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('pseudocode');
  const [codeLanguage, setCodeLanguage] = useState<CodeTargetLanguage>('java');
  const [draft, setDraft] = useState(() => loadExerciseUserDraft(exerciseId));
  const [copiedStatus, setCopiedStatus] = useState(false);
  const gutterRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const persistDraftField = (field: 'pseudocode' | 'code', value: string) => {
    const nextDraft = { ...draft, [field]: value };
    setDraft(nextDraft);
    saveExerciseUserDraft(exerciseId, nextDraft);
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextCode = event.target.value;
    const nextLanguage = detectCodeLanguage(nextCode, codeLanguage);
    if (nextLanguage !== codeLanguage) setCodeLanguage(nextLanguage);
    persistDraftField('code', nextCode);
  };

  const handleScroll = (event: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = event.currentTarget;
    if (gutterRef.current) gutterRef.current.scrollTop = scrollTop;
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextValue = `${textarea.value.substring(0, start)}    ${textarea.value.substring(end)}`;
    persistDraftField(activeTab === 'pseudocode' ? 'pseudocode' : 'code', nextValue);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 4;
    }, 0);
  };

  const handleCopyCurrentDraft = async () => {
    const textToCopy = activeTab === 'pseudocode' ? draft.pseudocode : draft.code;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch {
        setCopiedStatus(true);
      }
    }
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 1800);
  };

  const currentContent = activeTab === 'pseudocode' ? draft.pseudocode : draft.code;
  const currentLanguage: CodeLanguage = activeTab === 'pseudocode' ? 'pseudocode' : codeLanguage;
  const tokens = tokenizeCode(currentContent, currentLanguage);
  const totalLineNumbers = Math.max(currentContent.split('\n').length + 10, 30);

  return (
    <div className="flex h-full min-h-[320px] flex-1 flex-col overflow-hidden rounded-2xl border border-fuchsia-900/50 bg-zinc-950 text-zinc-100 shadow-md">
      <WorkspaceHeaderBar
        activeTab={activeTab}
        codeLanguage={codeLanguage}
        currentLanguage={currentLanguage}
        hasContent={Boolean(currentContent)}
        copiedStatus={copiedStatus}
        onSelectTab={setActiveTab}
        onSelectCodeLanguage={setCodeLanguage}
        onCopyDraft={handleCopyCurrentDraft}
        onClearDraft={() => persistDraftField(activeTab === 'pseudocode' ? 'pseudocode' : 'code', '')}
      />

      {activeTab === 'whiteboard' ? (
        <ExerciseWhiteboard exerciseId={exerciseId} exerciseTitle={exerciseTitle} />
      ) : (
        <div className="flex flex-1 min-h-0 overflow-hidden bg-zinc-950">
          <div
            ref={gutterRef}
            aria-hidden="true"
            className="w-12 shrink-0 select-none overflow-hidden border-r border-zinc-800/80 bg-zinc-900/50 py-3 pr-2.5 text-right font-mono text-xs leading-6 text-zinc-500"
          >
            {Array.from({ length: totalLineNumbers }, (_, index) => (
              <div key={index} className="leading-6">
                {index + 1}
              </div>
            ))}
          </div>

          <div className="relative flex-1 min-h-0 overflow-hidden font-mono text-xs leading-6 sm:text-sm">
            <pre
              ref={preRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 m-0 overflow-hidden p-3 font-mono text-xs leading-6 whitespace-pre sm:text-sm"
            >
              <code>
                {tokens.map((token, index) => (
                  <span key={index} className={token.colorClass}>
                    {token.text}
                  </span>
                ))}
                {currentContent.endsWith('\n') ? '\u00A0' : null}
              </code>
            </pre>

            <textarea
              value={currentContent}
              onScroll={handleScroll}
              onKeyDown={handleKeyDown}
              onChange={
                activeTab === 'pseudocode'
                  ? (event) => persistDraftField('pseudocode', event.target.value)
                  : handleCodeChange
              }
              placeholder={
                activeTab === 'pseudocode'
                  ? `Escribe aquí tu pseudocódigo para "${exerciseTitle}"...`
                  : `Escribe aquí tu código en ${codeLanguage === 'java' ? 'Java' : 'Python'} para "${exerciseTitle}"...`
              }
              aria-label={
                activeTab === 'pseudocode'
                  ? `Área de pseudocódigo para ${exerciseTitle}`
                  : `Área de código en ${codeLanguage} para ${exerciseTitle}`
              }
              className="absolute inset-0 m-0 h-full w-full resize-none overflow-auto bg-transparent p-3 font-mono text-xs leading-6 text-transparent caret-fuchsia-400 placeholder-zinc-600 outline-none whitespace-pre selection:bg-fuchsia-500/30 sm:text-sm"
              spellCheck={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}

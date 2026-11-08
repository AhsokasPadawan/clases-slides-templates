import { ReactNode, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, Pause, Play, RotateCcw } from 'lucide-react';
import { useSectionTheme } from '../domain/sectionThemes';

export interface AnimationPlayerShellProps {
  title: string;
  badge?: string;
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number;
  stepDescription?: ReactNode;
  onStepChange: (step: number) => void;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
  onReset?: () => void;
  children: ReactNode;
}

const SPEED_OPTIONS = [0.5, 1, 1.5, 2] as const;

export function AnimationPlayerShell({
  title,
  badge,
  currentStep,
  totalSteps,
  isPlaying,
  playbackSpeed,
  stepDescription,
  onStepChange,
  onTogglePlay,
  onSpeedChange,
  onReset,
  children,
}: AnimationPlayerShellProps) {
  const sectionTheme = useSectionTheme();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const intervalMs = Math.max(300, Math.round(1500 / playbackSpeed));
    timerRef.current = window.setInterval(() => {
      if (currentStep < totalSteps - 1) {
        onStepChange(currentStep + 1);
      } else {
        onTogglePlay();
      }
    }, intervalMs);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, currentStep, totalSteps, playbackSpeed, onStepChange, onTogglePlay]);

  return (
    <div className={`h-full min-h-full flex-1 flex flex-col justify-between rounded-2xl border p-3.5 sm:p-4 md:p-5 ${sectionTheme.analysisPanelClass}`}>
      <div className={`shrink-0 flex flex-wrap items-center justify-between gap-2 border-b pb-2.5 ${sectionTheme.analysisDividerClass}`}>
        <div className="flex items-center gap-2">
          {badge && (
            <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase ${sectionTheme.slideBadgeClass}`}>
              {badge}
            </span>
          )}
          <h3 className={`text-sm font-bold tracking-wide sm:text-base ${sectionTheme.titleTextClass}`}>
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold font-mono ${sectionTheme.slideHeaderClass}`}>
            Paso {currentStep + 1} de {totalSteps}
          </span>
          <div className={`flex items-center gap-1 rounded-lg border p-1 ${sectionTheme.analysisSubcardClass}`}>
            {SPEED_OPTIONS.map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => onSpeedChange(speed)}
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold transition ${
                  playbackSpeed === speed
                    ? sectionTheme.primaryButtonClass
                    : `${sectionTheme.slideHeaderClass} hover:opacity-80`
                }`}
                title={`Velocidad ${speed}x`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`flex-1 min-h-0 my-2.5 rounded-xl border-2 bg-zinc-950 p-3 sm:p-4 flex flex-col items-center justify-center overflow-y-auto text-zinc-100 ${sectionTheme.cardBorderClass}`}>
        {children}
      </div>

      {stepDescription && (
        <div className={`shrink-0 mb-2 rounded-lg border px-3.5 py-2 text-xs sm:text-sm font-medium ${sectionTheme.accentSurfaceClass} ${sectionTheme.strongTextClass}`}>
          {stepDescription}
        </div>
      )}

      <div className="shrink-0 flex items-center justify-between gap-2 sm:gap-3 pt-1">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onStepChange(0)}
            disabled={currentStep === 0}
            aria-label="Ir al inicio"
            title="Ir al inicio"
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:opacity-30 ${sectionTheme.secondaryButtonClass}`}
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => currentStep > 0 && onStepChange(currentStep - 1)}
            disabled={currentStep === 0}
            aria-label="Paso anterior"
            title="Paso anterior"
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:opacity-30 ${sectionTheme.secondaryButtonClass}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            title={isPlaying ? 'Pausa' : 'Reproducir'}
            className={`flex h-8 items-center gap-1.5 rounded-lg px-3 font-bold text-xs transition ${sectionTheme.primaryButtonClass}`}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
            <span>{isPlaying ? 'Pausa' : 'Play'}</span>
          </button>
          <button
            type="button"
            onClick={() => currentStep < totalSteps - 1 && onStepChange(currentStep + 1)}
            disabled={currentStep >= totalSteps - 1}
            aria-label="Paso siguiente"
            title="Paso siguiente"
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:opacity-30 ${sectionTheme.secondaryButtonClass}`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 min-w-0 flex items-center px-1 sm:px-2">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStep}
            onChange={(event) => onStepChange(Number(event.target.value))}
            aria-label={`Control deslizante de pasos para ${title}`}
            className={`h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 dark:bg-zinc-800 ${sectionTheme.sliderAccentClass}`}
          />
        </div>

        {onReset && (
          <div className="shrink-0 flex items-center">
            <button
              type="button"
              onClick={onReset}
              title="Reiniciar a valores iniciales"
              aria-label="Reiniciar visualizador"
              className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${sectionTheme.secondaryButtonClass}`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reiniciar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

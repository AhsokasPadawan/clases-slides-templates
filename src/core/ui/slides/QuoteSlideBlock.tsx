import { Quote } from 'lucide-react';
import { ConceptSlide } from '../../domain/coreTypes';
import { SectionTheme } from '../../domain/sectionThemes';

export interface QuoteSlideBlockProps {
  slide: ConceptSlide;
  sectionTheme: SectionTheme;
  isMobileFeed?: boolean;
}

export function QuoteSlideBlock({ slide, sectionTheme }: QuoteSlideBlockProps) {
  if (!slide.quoteData) {
    return null;
  }

  return (
    <div
      className={`w-full h-auto md:h-full md:flex-1 flex flex-col justify-between rounded-2xl border p-5 sm:p-7 shadow-lg overflow-visible md:overflow-hidden ${sectionTheme.quoteCardClass}`}
    >
      <div
        className={`shrink-0 flex items-center justify-between border-b pb-2.5 ${sectionTheme.cardBorderClass}`}
      >
        <div className="flex items-center gap-2">
          <Quote className={`h-5 w-5 ${sectionTheme.bulletMarkerClass}`} />
          <span
            className={`text-xs sm:text-sm font-black uppercase tracking-wider ${sectionTheme.slideHeaderClass}`}
          >
            {slide.conceptSubtitle || 'Epígrafe'}
          </span>
        </div>
        <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${sectionTheme.slideBadgeClass}`}>
          Epígrafe
        </span>
      </div>

      <div className="my-auto py-3 px-2 sm:px-6 flex flex-col items-center text-center">
        <p
          className={`text-lg sm:text-2xl md:text-3xl font-serif italic font-semibold leading-relaxed max-w-4xl ${sectionTheme.titleTextClass}`}
        >
          “{slide.quoteData.quote}”
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className={`text-xs sm:text-sm md:text-base font-black ${sectionTheme.slideHeaderClass}`}>
            — {slide.quoteData.author}
          </span>
          {slide.quoteData.source && (
            <span className="text-[11px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400">
              · {slide.quoteData.source}
            </span>
          )}
        </div>
      </div>

      {slide.quoteData.pedagogicalContext && (
        <div
          className={`shrink-0 rounded-xl border p-3 sm:p-3.5 shadow-xs ${sectionTheme.accentSurfaceClass}`}
        >
          <span
            className={`block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-0.5 ${sectionTheme.slideHeaderClass}`}
          >
            Enfoque Didáctico de la Cátedra
          </span>
          <p className="text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">
            {slide.quoteData.pedagogicalContext}
          </p>
        </div>
      )}
    </div>
  );
}

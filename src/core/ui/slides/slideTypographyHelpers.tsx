import { ReactNode } from 'react';
import { SectionTheme } from '../../domain/sectionThemes';
import { MathFormula } from '../MathFormula';

const FORMULA_GRID_COLS_LOOKUP: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
};

export function getFormulaGridColsClass(count: number): string {
  return FORMULA_GRID_COLS_LOOKUP[count] ?? 'grid-cols-1 md:grid-cols-3';
}

export function parseInlineTokens(text: string): ReactNode[] {
  const tokenRegex = /(\$[^$]+\$|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      const latex = part.slice(1, -1);
      return <MathFormula key={index} expression={latex} />;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold">
          {boldText}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const italicText = part.slice(1, -1);
      return (
        <em key={index} className="italic">
          {italicText}
        </em>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export function getSummaryTypographyClass(textLength: number, titleTextClass: string): string {
  if (textLength < 140) {
    return `text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed font-bold ${titleTextClass}`;
  }
  if (textLength < 250) {
    return `text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed font-semibold ${titleTextClass}`;
  }
  return `text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed font-semibold ${titleTextClass}`;
}

export function renderColonFormattedLine(line: string, strongTextClass: string) {
  const colonIndex = line.indexOf(':');
  if (colonIndex === -1) {
    return <span>{parseInlineTokens(line)}</span>;
  }
  let rawPrefix = line.slice(0, colonIndex).trim();
  if (rawPrefix.startsWith('**') && rawPrefix.endsWith('**') && rawPrefix.length > 4) {
    rawPrefix = rawPrefix.slice(2, -2).trim();
  }
  const rest = line.slice(colonIndex + 1);

  return (
    <span>
      <strong className={`font-bold ${strongTextClass}`}>{rawPrefix}:</strong>
      {parseInlineTokens(rest)}
    </span>
  );
}

export function renderSummaryContent(
  summary: string,
  typographyClass: string,
  sectionTheme: SectionTheme,
) {
  const lines = summary.split('\n');
  if (lines.length === 1) {
    return (
      <p className={typographyClass}>
        {renderColonFormattedLine(lines[0], sectionTheme.strongTextClass)}
      </p>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 sm:gap-2 ${typographyClass}`}>
      <p>{renderColonFormattedLine(lines[0], sectionTheme.strongTextClass)}</p>
      <div
        className={`flex flex-col gap-1 sm:gap-1.5 pl-2.5 sm:pl-3.5 border-l-2 ${sectionTheme.inlineAccentBorderClass} text-xs sm:text-sm md:text-base font-semibold`}
      >
        {lines.slice(1).map((line, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className={`${sectionTheme.bulletMarkerClass} font-bold select-none`}>•</span>
            <div>
              {renderColonFormattedLine(
                line.replace(/^[•\-*]\s*/, ''),
                sectionTheme.strongTextClass,
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function renderFormattedPoint(
  pointText: string,
  textClass: string,
  sectionTheme: SectionTheme,
  subTextClass?: string,
) {
  const lines = pointText.split('\n');
  if (lines.length === 1) {
    return (
      <span className={textClass}>
        {renderColonFormattedLine(lines[0], sectionTheme.strongTextClass)}
      </span>
    );
  }

  const [firstLine, ...subLines] = lines;
  const actualSubTextClass = subTextClass || textClass;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className={textClass}>
        {renderColonFormattedLine(firstLine, sectionTheme.strongTextClass)}
      </div>
      <div
        className={`flex flex-col gap-1.5 pl-3 sm:pl-4 border-l-2 ${sectionTheme.inlineAccentBorderClass} my-0.5`}
      >
        {subLines.map((subLine, idx) => (
          <div key={idx} className={`flex items-start gap-2 ${actualSubTextClass}`}>
            <span className={`${sectionTheme.bulletMarkerClass} font-bold select-none`}>•</span>
            <div>{renderColonFormattedLine(subLine, sectionTheme.strongTextClass)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function getBulletFlexWeight(text: string): number {
  const lineCount = text.split('\n').length;
  const lengthScore = text.length / 120;
  return Math.max(1, Math.round(lineCount * 1.5 + lengthScore));
}

export function getBulletTypographyConfig(
  itemCount: number,
  averageLength: number,
  stepBadgeClass: string,
  accentSurfaceClass: string,
) {
  if (itemCount <= 3 && averageLength < 220) {
    return {
      textClass:
        'text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-relaxed text-zinc-800 dark:text-zinc-200',
      subTextClass:
        'text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300',
      badgeClass: `flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl text-sm sm:text-base md:text-lg font-bold shadow-xs my-auto ${stepBadgeClass}`,
      itemClass: `w-full flex items-center gap-3.5 sm:gap-4 rounded-2xl border p-3 sm:p-3.5 md:p-4 shadow-xs transition-all ${accentSurfaceClass}`,
      listGapClass:
        'flex-1 min-h-0 flex flex-col justify-between gap-2.5 sm:gap-3 overflow-visible md:overflow-hidden',
    };
  }
  if (itemCount >= 5) {
    return {
      textClass:
        'text-xs sm:text-sm md:text-base font-medium leading-snug text-zinc-800 dark:text-zinc-200',
      subTextClass:
        'text-[11px] sm:text-xs md:text-sm leading-snug text-zinc-700 dark:text-zinc-300',
      badgeClass: `flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg text-xs sm:text-sm font-bold shadow-xs my-auto ${stepBadgeClass}`,
      itemClass: `w-full flex items-center gap-2.5 sm:gap-3 rounded-xl border px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-xs transition-all ${accentSurfaceClass}`,
      listGapClass:
        'flex-1 min-h-0 flex flex-col justify-between gap-1.5 sm:gap-2 overflow-visible md:overflow-hidden',
    };
  }
  return {
    textClass:
      'text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-relaxed text-zinc-800 dark:text-zinc-200',
    subTextClass:
      'text-xs sm:text-sm md:text-base leading-relaxed text-zinc-700 dark:text-zinc-300',
    badgeClass: `flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-xl text-xs sm:text-sm md:text-base font-bold shadow-xs my-auto ${stepBadgeClass}`,
    itemClass: `w-full flex items-center gap-3 rounded-xl border p-2 sm:p-2.5 md:p-3 shadow-xs transition-all ${accentSurfaceClass}`,
    listGapClass:
      'flex-1 min-h-0 flex flex-col justify-between gap-2 sm:gap-2.5 overflow-visible md:overflow-hidden',
  };
}

import { ConceptSlide } from '../../domain/coreTypes';
import { SectionTheme } from '../../domain/sectionThemes';
import { MathFormula } from '../MathFormula';
import {
  getBulletFlexWeight,
  getBulletTypographyConfig,
  getFormulaGridColsClass,
  getSummaryTypographyClass,
  renderFormattedPoint,
  renderSummaryContent,
} from './slideTypographyHelpers';

export interface TheorySlideBlockProps {
  slide: ConceptSlide;
  sectionTheme: SectionTheme;
  isMobileFeed?: boolean;
}

export function TheorySlideBlock({ slide, sectionTheme, isMobileFeed }: TheorySlideBlockProps) {
  if (!slide.theoryData) {
    return null;
  }

  const bulletItemCount = slide.theoryData.bulletPoints?.length ?? 0;
  const bulletAverageLength =
    bulletItemCount > 0
      ? (slide.theoryData.bulletPoints?.reduce((acc, str) => acc + str.length, 0) ?? 0) /
        bulletItemCount
      : 0;
  const bulletTypography = getBulletTypographyConfig(
    bulletItemCount,
    bulletAverageLength,
    sectionTheme.stepBadgeClass,
    sectionTheme.accentSurfaceClass,
  );
  const summaryTypographyClass = getSummaryTypographyClass(
    slide.theoryData.summary?.length ?? 0,
    sectionTheme.titleTextClass,
  );
  const formulaCount = slide.theoryData.formulas?.length ?? 0;
  const formulaGridColsClass = getFormulaGridColsClass(formulaCount);

  if (formulaCount > 0) {
    return (
      <div className="w-full h-auto md:h-full md:flex-1 flex flex-col justify-between gap-2.5 sm:gap-3 overflow-visible md:overflow-hidden">
        <div
          className={`shrink-0 rounded-2xl border p-2.5 sm:p-3 flex flex-col justify-start gap-2 shadow-xs overflow-visible md:overflow-hidden ${sectionTheme.formulaContainerClass}`}
        >
          {slide.theoryData.summary &&
            renderSummaryContent(
              slide.theoryData.summary,
              summaryTypographyClass,
              sectionTheme,
            )}

          <div className={`grid gap-2 ${formulaGridColsClass}`}>
            {slide.theoryData.formulas?.map((formula) => (
              <div
                key={formula.label}
                className={`rounded-xl border px-3 py-1.5 sm:py-2 flex flex-col justify-between ${sectionTheme.formulaCardClass}`}
              >
                <p
                  className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wide ${sectionTheme.formulaLabelClass}`}
                >
                  {formula.label}
                </p>
                <MathFormula
                  expression={formula.latex}
                  displayMode
                  className={`${sectionTheme.titleTextClass} text-xs sm:text-sm my-0.5`}
                />
                <p
                  className={`text-[10px] sm:text-xs leading-tight ${sectionTheme.formulaDescriptionClass}`}
                >
                  {formula.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {slide.theoryData.bulletPoints && slide.theoryData.bulletPoints.length > 0 && (
          <div
            className={`w-full h-auto md:h-full md:flex-1 rounded-2xl border bg-white dark:bg-zinc-900 p-3 sm:p-3.5 flex flex-col justify-start shadow-xs overflow-visible md:overflow-hidden ${sectionTheme.cardBorderClass}`}
          >
            <ul className={bulletTypography.listGapClass}>
              {slide.theoryData.bulletPoints.map((pointText, index) => (
                <li
                  key={index}
                  style={isMobileFeed ? undefined : { flex: `${getBulletFlexWeight(pointText)} 1 0%` }}
                  className={`${bulletTypography.itemClass} !flex-none md:!flex-1 overflow-visible md:overflow-hidden`}
                >
                  <span className={bulletTypography.badgeClass}>{index + 1}</span>
                  <div className="flex-1 min-w-0 my-auto">
                    {renderFormattedPoint(
                      pointText,
                      bulletTypography.textClass,
                      sectionTheme,
                      bulletTypography.subTextClass,
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-auto md:h-full md:flex-1 flex flex-col justify-between gap-2.5 sm:gap-3 overflow-visible md:overflow-hidden">
      <div
        className={`w-full h-auto md:h-full md:flex-1 flex flex-col justify-start rounded-2xl border bg-white dark:bg-zinc-900 p-4 sm:p-5 shadow-xs overflow-visible md:overflow-hidden ${sectionTheme.cardBorderClass}`}
      >
        {slide.theoryData.summary && (
          <div className={`shrink-0 border-b pb-2.5 mb-3 ${sectionTheme.cardBorderClass}`}>
            {renderSummaryContent(
              slide.theoryData.summary,
              summaryTypographyClass,
              sectionTheme,
            )}
          </div>
        )}

        {slide.theoryData.bulletPoints && slide.theoryData.bulletPoints.length > 0 && (
          <ul className={bulletTypography.listGapClass}>
            {slide.theoryData.bulletPoints.map((pointText, index) => (
              <li
                key={index}
                style={isMobileFeed ? undefined : { flex: `${getBulletFlexWeight(pointText)} 1 0%` }}
                className={`${bulletTypography.itemClass} !flex-none md:!flex-1 overflow-visible md:overflow-hidden`}
              >
                <span className={bulletTypography.badgeClass}>{index + 1}</span>
                <div className="flex-1 min-w-0 my-auto">
                  {renderFormattedPoint(
                    pointText,
                    bulletTypography.textClass,
                    sectionTheme,
                    bulletTypography.subTextClass,
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {slide.theoryData.callout ? (
          <div className="shrink-0 mt-2.5 rounded-xl border-2 border-amber-400 bg-white p-3 sm:p-3.5 shadow-xs dark:border-amber-400 dark:bg-zinc-900">
            <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-0.5">
              {slide.theoryData.callout.title}
            </p>
            <p className="text-xs sm:text-sm md:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
              {slide.theoryData.callout.text}
            </p>
          </div>
        ) : slide.theoryData.keyInsight ? (
          <div
            className={`shrink-0 mt-2.5 rounded-xl border p-2.5 sm:p-3 ${sectionTheme.accentSurfaceClass}`}
          >
            <p className={`text-[11px] sm:text-xs font-medium ${sectionTheme.strongTextClass}`}>
              <span className={`font-bold ${sectionTheme.slideHeaderClass}`}>
                Invariante Pedagógico:{' '}
              </span>
              {slide.theoryData.keyInsight}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

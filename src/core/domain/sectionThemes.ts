import { createContext, useContext } from 'react';
import { ModuleId } from './coreTypes';

export type SectionThemePaletteKey =
  | 'stone'
  | 'sky'
  | 'rose'
  | 'emerald'
  | 'amber'
  | 'violet'
  | 'fuchsia';

export interface SectionTheme {
  moduleId: ModuleId;
  name: string;
  pastelName: string;
  dotClass: string;
  badgeClass: string;
  sidebarRailActiveClass: string;
  sidebarActiveClass: string;
  sidebarBorderClass: string;
  sidebarAccordionBorderClass: string;
  subtopicActiveClass: string;
  subtopicHoverClass: string;
  pageBgClass: string;
  slideBadgeClass: string;
  slideHeaderClass: string;
  titleTextClass: string;
  strongTextClass: string;
  inlineAccentBorderClass: string;
  bulletMarkerClass: string;
  cardBorderClass: string;
  counterBoxClass: string;
  accentSurfaceClass: string;
  quoteCardClass: string;
  formulaContainerClass: string;
  formulaCardClass: string;
  formulaLabelClass: string;
  formulaDescriptionClass: string;
  analysisPanelClass: string;
  analysisDividerClass: string;
  analysisSubcardClass: string;
  analysisInnerCellClass: string;
  analysisAccentTextClass: string;
  stepBadgeClass: string;
  primaryButtonClass: string;
  secondaryButtonClass: string;
  sliderAccentClass: string;
}

export const SECTION_THEME_PALETTES: Record<SectionThemePaletteKey, SectionTheme> = {
  stone: {
    moduleId: 'stone',
    name: 'Tema 0',
    pastelName: 'Piedra Cálida Pastel',
    dotClass: 'bg-stone-500 dark:bg-stone-300',
    badgeClass: 'bg-white text-stone-800 border border-stone-300 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-600',
    sidebarRailActiveClass: 'bg-white text-stone-900 border border-stone-300 font-black shadow-xs dark:bg-stone-200 dark:text-stone-950 dark:border-stone-300',
    sidebarActiveClass: 'bg-white text-stone-900 border border-stone-300 font-bold shadow-xs dark:bg-stone-200 dark:text-stone-950 dark:border-stone-300',
    sidebarBorderClass: 'border-stone-300 dark:border-stone-400/40',
    sidebarAccordionBorderClass: 'border-stone-400 dark:border-stone-400/60',
    subtopicActiveClass: 'bg-white text-stone-900 font-bold border-l-2 border-stone-600 shadow-2xs dark:bg-stone-300/20 dark:text-stone-100 dark:border-stone-300',
    subtopicHoverClass: 'text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-white',
    pageBgClass: 'bg-white dark:bg-zinc-950',
    slideBadgeClass: 'bg-white text-stone-800 border border-stone-300 shadow-xs shadow-stone-500/10 dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700',
    slideHeaderClass: 'text-stone-700 dark:text-stone-300',
    titleTextClass: 'text-stone-900 dark:text-stone-100',
    strongTextClass: 'text-stone-800 dark:text-stone-200',
    inlineAccentBorderClass: 'border-stone-400 dark:border-stone-500',
    bulletMarkerClass: 'text-stone-600 dark:text-stone-400',
    cardBorderClass: 'border-stone-300 shadow-md shadow-stone-500/10 dark:border-zinc-800',
    counterBoxClass: 'border-stone-300 bg-white text-stone-900 shadow-xs shadow-stone-500/10 dark:border-stone-700 dark:bg-zinc-900 dark:text-stone-100',
    accentSurfaceClass: 'border-stone-300 bg-white shadow-xs shadow-stone-500/10 dark:border-zinc-800 dark:bg-zinc-900',
    quoteCardClass: 'border-stone-300 bg-white shadow-lg shadow-stone-500/10 dark:border-stone-800 dark:bg-zinc-900',
    formulaContainerClass: 'border-stone-300 bg-white shadow-md shadow-stone-500/10 dark:border-stone-800 dark:bg-zinc-900',
    formulaCardClass: 'border-stone-300 bg-white text-stone-900 shadow-xs shadow-stone-500/10 dark:border-stone-700 dark:bg-zinc-950 dark:text-stone-100',
    formulaLabelClass: 'text-stone-700 dark:text-stone-300',
    formulaDescriptionClass: 'text-stone-600 dark:text-stone-400',
    analysisPanelClass: 'border-stone-300 bg-white text-stone-900 shadow-md shadow-stone-500/10 dark:border-stone-800 dark:bg-zinc-900 dark:text-stone-100',
    analysisDividerClass: 'border-stone-200 dark:border-stone-800',
    analysisSubcardClass: 'border-stone-300 bg-white shadow-xs shadow-stone-500/5 dark:border-stone-800 dark:bg-zinc-950/70',
    analysisInnerCellClass: 'border-stone-200 bg-white dark:border-stone-800 dark:bg-zinc-900',
    analysisAccentTextClass: 'text-stone-700 dark:text-stone-300',
    stepBadgeClass: 'bg-white text-stone-800 border border-stone-300 shadow-xs shadow-stone-500/10 dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700',
    primaryButtonClass: 'bg-stone-100 text-stone-900 border border-stone-300 hover:bg-stone-200/80 shadow-xs shadow-stone-500/10 dark:bg-stone-700 dark:text-stone-100 dark:border-stone-600 dark:hover:bg-stone-600',
    secondaryButtonClass: 'border-stone-300 bg-white text-stone-800 hover:bg-stone-50 shadow-xs shadow-stone-500/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700',
    sliderAccentClass: 'accent-stone-600 dark:accent-stone-400',
  },
  sky: {
    moduleId: 'sky',
    name: 'Tema 1',
    pastelName: 'Celeste Cielo Pastel',
    dotClass: 'bg-sky-500 dark:bg-sky-300',
    badgeClass: 'bg-white text-sky-800 border border-sky-300 dark:bg-sky-900/40 dark:text-sky-200 dark:border-sky-500/40',
    sidebarRailActiveClass: 'bg-white text-sky-950 border border-sky-300 font-black shadow-xs dark:bg-sky-200 dark:text-sky-950 dark:border-sky-300',
    sidebarActiveClass: 'bg-white text-sky-950 border border-sky-300 font-bold shadow-xs dark:bg-sky-200 dark:text-sky-950 dark:border-sky-300',
    sidebarBorderClass: 'border-sky-300 dark:border-sky-400/40',
    sidebarAccordionBorderClass: 'border-sky-400 dark:border-sky-400/60',
    subtopicActiveClass: 'bg-white text-sky-900 font-bold border-l-2 border-sky-500 shadow-2xs dark:bg-sky-400/20 dark:text-sky-100 dark:border-sky-300',
    subtopicHoverClass: 'text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-white',
    pageBgClass: 'bg-white dark:bg-zinc-950',
    slideBadgeClass: 'bg-white text-sky-800 border border-sky-300 shadow-xs shadow-sky-500/10 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-800',
    slideHeaderClass: 'text-sky-600 dark:text-sky-400',
    titleTextClass: 'text-sky-950 dark:text-sky-100',
    strongTextClass: 'text-sky-800 dark:text-sky-300',
    inlineAccentBorderClass: 'border-sky-400 dark:border-sky-500',
    bulletMarkerClass: 'text-sky-500 dark:text-sky-400',
    cardBorderClass: 'border-sky-300 shadow-md shadow-sky-500/10 dark:border-sky-900/50',
    counterBoxClass: 'border-sky-300 bg-white text-sky-900 shadow-xs shadow-sky-500/10 dark:border-sky-800 dark:bg-zinc-900 dark:text-sky-200',
    accentSurfaceClass: 'border-sky-300 bg-white shadow-xs shadow-sky-500/10 dark:border-sky-900/40 dark:bg-zinc-900',
    quoteCardClass: 'border-sky-300 bg-white shadow-lg shadow-sky-500/10 dark:border-sky-800/60 dark:bg-zinc-900',
    formulaContainerClass: 'border-sky-300 bg-white shadow-md shadow-sky-500/10 dark:border-sky-800/60 dark:bg-zinc-900',
    formulaCardClass: 'border-sky-300 bg-white text-sky-950 shadow-xs shadow-sky-500/10 dark:border-sky-800/60 dark:bg-zinc-950 dark:text-sky-100',
    formulaLabelClass: 'text-sky-700 dark:text-sky-300',
    formulaDescriptionClass: 'text-sky-800/80 dark:text-sky-300/80',
    analysisPanelClass: 'border-sky-300 bg-white text-sky-950 shadow-md shadow-sky-500/10 dark:border-sky-800/60 dark:bg-zinc-900 dark:text-sky-100',
    analysisDividerClass: 'border-sky-200 dark:border-sky-800/60',
    analysisSubcardClass: 'border-sky-300 bg-white shadow-xs shadow-sky-500/5 dark:border-sky-900/50 dark:bg-zinc-950/70',
    analysisInnerCellClass: 'border-sky-200 bg-white dark:border-sky-900/50 dark:bg-zinc-900',
    analysisAccentTextClass: 'text-sky-700 dark:text-sky-300',
    stepBadgeClass: 'bg-white text-sky-800 border border-sky-300 shadow-xs shadow-sky-500/10 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-800',
    primaryButtonClass: 'bg-sky-50 text-sky-900 border border-sky-300 hover:bg-sky-100 shadow-xs shadow-sky-500/10 dark:bg-sky-900 dark:text-sky-100 dark:border-sky-700 dark:hover:bg-sky-800',
    secondaryButtonClass: 'border-sky-300 bg-white text-sky-800 hover:bg-sky-50 shadow-xs shadow-sky-500/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700',
    sliderAccentClass: 'accent-sky-600 dark:accent-sky-400',
  },
  rose: {
    moduleId: 'rose',
    name: 'Tema 2',
    pastelName: 'Coral Durazno Pastel',
    dotClass: 'bg-rose-500 dark:bg-rose-300',
    badgeClass: 'bg-white text-rose-800 border border-rose-300 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-500/40',
    sidebarRailActiveClass: 'bg-white text-rose-950 border border-rose-300 font-black shadow-xs dark:bg-rose-200 dark:text-rose-950 dark:border-rose-300',
    sidebarActiveClass: 'bg-white text-rose-950 border border-rose-300 font-bold shadow-xs dark:bg-rose-200 dark:text-rose-950 dark:border-rose-300',
    sidebarBorderClass: 'border-rose-300 dark:border-rose-400/40',
    sidebarAccordionBorderClass: 'border-rose-400 dark:border-rose-400/60',
    subtopicActiveClass: 'bg-white text-rose-900 font-bold border-l-2 border-rose-500 shadow-2xs dark:bg-rose-400/20 dark:text-rose-100 dark:border-rose-300',
    subtopicHoverClass: 'text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-white',
    pageBgClass: 'bg-white dark:bg-zinc-950',
    slideBadgeClass: 'bg-white text-rose-800 border border-rose-300 shadow-xs shadow-rose-500/10 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800',
    slideHeaderClass: 'text-rose-600 dark:text-rose-400',
    titleTextClass: 'text-rose-950 dark:text-rose-100',
    strongTextClass: 'text-rose-800 dark:text-rose-300',
    inlineAccentBorderClass: 'border-rose-400 dark:border-rose-500',
    bulletMarkerClass: 'text-rose-500 dark:text-rose-400',
    cardBorderClass: 'border-rose-300 shadow-md shadow-rose-500/10 dark:border-rose-900/50',
    counterBoxClass: 'border-rose-300 bg-white text-rose-900 shadow-xs shadow-rose-500/10 dark:border-rose-800 dark:bg-zinc-900 dark:text-rose-200',
    accentSurfaceClass: 'border-rose-300 bg-white shadow-xs shadow-rose-500/10 dark:border-rose-900/40 dark:bg-zinc-900',
    quoteCardClass: 'border-rose-300 bg-white shadow-lg shadow-rose-500/10 dark:border-rose-800/60 dark:bg-zinc-900',
    formulaContainerClass: 'border-rose-300 bg-white shadow-md shadow-rose-500/10 dark:border-rose-800/60 dark:bg-zinc-900',
    formulaCardClass: 'border-rose-300 bg-white text-rose-950 shadow-xs shadow-rose-500/10 dark:border-rose-800/60 dark:bg-zinc-950 dark:text-rose-100',
    formulaLabelClass: 'text-rose-700 dark:text-rose-300',
    formulaDescriptionClass: 'text-rose-800/80 dark:text-rose-300/80',
    analysisPanelClass: 'border-rose-300 bg-white text-rose-950 shadow-md shadow-rose-500/10 dark:border-rose-800/60 dark:bg-zinc-900 dark:text-rose-100',
    analysisDividerClass: 'border-rose-200 dark:border-rose-800/60',
    analysisSubcardClass: 'border-rose-300 bg-white shadow-xs shadow-rose-500/5 dark:border-rose-900/50 dark:bg-zinc-950/70',
    analysisInnerCellClass: 'border-rose-200 bg-white dark:border-rose-900/50 dark:bg-zinc-900',
    analysisAccentTextClass: 'text-rose-700 dark:text-rose-300',
    stepBadgeClass: 'bg-white text-rose-800 border border-rose-300 shadow-xs shadow-rose-500/10 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800',
    primaryButtonClass: 'bg-rose-50 text-rose-900 border border-rose-300 hover:bg-rose-100 shadow-xs shadow-rose-500/10 dark:bg-rose-900 dark:text-rose-100 dark:border-rose-700 dark:hover:bg-rose-800',
    secondaryButtonClass: 'border-rose-300 bg-white text-rose-800 hover:bg-rose-50 shadow-xs shadow-rose-500/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700',
    sliderAccentClass: 'accent-rose-600 dark:accent-rose-400',
  },
  emerald: {
    moduleId: 'emerald',
    name: 'Tema 3',
    pastelName: 'Verde Salvia Menta Pastel',
    dotClass: 'bg-emerald-500 dark:bg-emerald-300',
    badgeClass: 'bg-white text-emerald-800 border border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-500/40',
    sidebarRailActiveClass: 'bg-white text-emerald-950 border border-emerald-300 font-black shadow-xs dark:bg-emerald-200 dark:text-emerald-950 dark:border-emerald-300',
    sidebarActiveClass: 'bg-white text-emerald-950 border border-emerald-300 font-bold shadow-xs dark:bg-emerald-200 dark:text-emerald-950 dark:border-emerald-300',
    sidebarBorderClass: 'border-emerald-300 dark:border-emerald-400/40',
    sidebarAccordionBorderClass: 'border-emerald-400 dark:border-emerald-400/60',
    subtopicActiveClass: 'bg-white text-emerald-900 font-bold border-l-2 border-emerald-500 shadow-2xs dark:bg-emerald-400/20 dark:text-emerald-100 dark:border-emerald-300',
    subtopicHoverClass: 'text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-white',
    pageBgClass: 'bg-white dark:bg-zinc-950',
    slideBadgeClass: 'bg-white text-emerald-800 border border-emerald-300 shadow-xs shadow-emerald-500/10 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800',
    slideHeaderClass: 'text-emerald-600 dark:text-emerald-400',
    titleTextClass: 'text-emerald-950 dark:text-emerald-100',
    strongTextClass: 'text-emerald-800 dark:text-emerald-300',
    inlineAccentBorderClass: 'border-emerald-400 dark:border-emerald-500',
    bulletMarkerClass: 'text-emerald-500 dark:text-emerald-400',
    cardBorderClass: 'border-emerald-300 shadow-md shadow-emerald-500/10 dark:border-emerald-900/50',
    counterBoxClass: 'border-emerald-300 bg-white text-emerald-900 shadow-xs shadow-emerald-500/10 dark:border-emerald-800 dark:bg-zinc-900 dark:text-emerald-200',
    accentSurfaceClass: 'border-emerald-300 bg-white shadow-xs shadow-emerald-500/10 dark:border-emerald-900/40 dark:bg-zinc-900',
    quoteCardClass: 'border-emerald-300 bg-white shadow-lg shadow-emerald-500/10 dark:border-emerald-800/60 dark:bg-zinc-900',
    formulaContainerClass: 'border-emerald-300 bg-white shadow-md shadow-emerald-500/10 dark:border-emerald-800/60 dark:bg-zinc-900',
    formulaCardClass: 'border-emerald-300 bg-white text-emerald-950 shadow-xs shadow-emerald-500/10 dark:border-emerald-800/60 dark:bg-zinc-950 dark:text-emerald-100',
    formulaLabelClass: 'text-emerald-700 dark:text-emerald-300',
    formulaDescriptionClass: 'text-emerald-800/80 dark:text-emerald-300/80',
    analysisPanelClass: 'border-emerald-300 bg-white text-emerald-950 shadow-md shadow-emerald-500/10 dark:border-emerald-800/60 dark:bg-zinc-900 dark:text-emerald-100',
    analysisDividerClass: 'border-emerald-200 dark:border-emerald-800/60',
    analysisSubcardClass: 'border-emerald-300 bg-white shadow-xs shadow-emerald-500/5 dark:border-emerald-900/50 dark:bg-zinc-950/70',
    analysisInnerCellClass: 'border-emerald-200 bg-white dark:border-emerald-900/50 dark:bg-zinc-900',
    analysisAccentTextClass: 'text-emerald-700 dark:text-emerald-300',
    stepBadgeClass: 'bg-white text-emerald-800 border border-emerald-300 shadow-xs shadow-emerald-500/10 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800',
    primaryButtonClass: 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 shadow-xs shadow-emerald-500/10 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-700 dark:hover:bg-emerald-800',
    secondaryButtonClass: 'border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50 shadow-xs shadow-emerald-500/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700',
    sliderAccentClass: 'accent-emerald-600 dark:accent-emerald-400',
  },
  amber: {
    moduleId: 'amber',
    name: 'Tema 4',
    pastelName: 'Ámbar Miel Pastel',
    dotClass: 'bg-amber-500 dark:bg-amber-300',
    badgeClass: 'bg-white text-amber-900 border border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-500/40',
    sidebarRailActiveClass: 'bg-white text-amber-950 border border-amber-300 font-black shadow-xs dark:bg-amber-200 dark:text-amber-950 dark:border-amber-300',
    sidebarActiveClass: 'bg-white text-amber-950 border border-amber-300 font-bold shadow-xs dark:bg-amber-200 dark:text-amber-950 dark:border-amber-300',
    sidebarBorderClass: 'border-amber-300 dark:border-amber-400/40',
    sidebarAccordionBorderClass: 'border-amber-400 dark:border-amber-400/60',
    subtopicActiveClass: 'bg-white text-amber-900 font-bold border-l-2 border-amber-500 shadow-2xs dark:bg-amber-400/20 dark:text-amber-100 dark:border-amber-300',
    subtopicHoverClass: 'text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-white',
    pageBgClass: 'bg-white dark:bg-zinc-950',
    slideBadgeClass: 'bg-white text-amber-900 border border-amber-300 shadow-xs shadow-amber-500/10 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800',
    slideHeaderClass: 'text-amber-700 dark:text-amber-400',
    titleTextClass: 'text-amber-950 dark:text-amber-100',
    strongTextClass: 'text-amber-800 dark:text-amber-300',
    inlineAccentBorderClass: 'border-amber-400 dark:border-amber-500',
    bulletMarkerClass: 'text-amber-600 dark:text-amber-400',
    cardBorderClass: 'border-amber-300 shadow-md shadow-amber-500/10 dark:border-amber-900/50',
    counterBoxClass: 'border-amber-300 bg-white text-amber-900 shadow-xs shadow-amber-500/10 dark:border-amber-800 dark:bg-zinc-900 dark:text-amber-200',
    accentSurfaceClass: 'border-amber-300 bg-white shadow-xs shadow-amber-500/10 dark:border-amber-900/40 dark:bg-zinc-900',
    quoteCardClass: 'border-amber-300 bg-white shadow-lg shadow-amber-500/10 dark:border-amber-800/60 dark:bg-zinc-900',
    formulaContainerClass: 'border-amber-300 bg-white shadow-md shadow-amber-500/10 dark:border-amber-800/60 dark:bg-zinc-900',
    formulaCardClass: 'border-amber-300 bg-white text-amber-950 shadow-xs shadow-amber-500/10 dark:border-amber-800/60 dark:bg-zinc-950 dark:text-amber-100',
    formulaLabelClass: 'text-amber-700 dark:text-amber-300',
    formulaDescriptionClass: 'text-amber-800/80 dark:text-amber-300/80',
    analysisPanelClass: 'border-amber-300 bg-white text-amber-950 shadow-md shadow-amber-500/10 dark:border-amber-800/60 dark:bg-zinc-900 dark:text-amber-100',
    analysisDividerClass: 'border-amber-200 dark:border-amber-800/60',
    analysisSubcardClass: 'border-amber-300 bg-white shadow-xs shadow-amber-500/5 dark:border-amber-900/50 dark:bg-zinc-950/70',
    analysisInnerCellClass: 'border-amber-200 bg-white dark:border-amber-900/50 dark:bg-zinc-900',
    analysisAccentTextClass: 'text-amber-700 dark:text-amber-300',
    stepBadgeClass: 'bg-white text-amber-900 border border-amber-300 shadow-xs shadow-amber-500/10 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800',
    primaryButtonClass: 'bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100 shadow-xs shadow-amber-500/10 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700 dark:hover:bg-amber-800',
    secondaryButtonClass: 'border-amber-300 bg-white text-amber-900 hover:bg-amber-50 shadow-xs shadow-amber-500/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700',
    sliderAccentClass: 'accent-amber-600 dark:accent-amber-400',
  },
  violet: {
    moduleId: 'violet',
    name: 'Tema 5',
    pastelName: 'Lavanda Violeta Pastel',
    dotClass: 'bg-violet-500 dark:bg-violet-300',
    badgeClass: 'bg-white text-violet-800 border border-violet-300 dark:bg-violet-900/40 dark:text-violet-200 dark:border-violet-500/40',
    sidebarRailActiveClass: 'bg-white text-violet-950 border border-violet-300 font-black shadow-xs dark:bg-violet-200 dark:text-violet-950 dark:border-violet-300',
    sidebarActiveClass: 'bg-white text-violet-950 border border-violet-300 font-bold shadow-xs dark:bg-violet-200 dark:text-violet-950 dark:border-violet-300',
    sidebarBorderClass: 'border-violet-300 dark:border-violet-400/40',
    sidebarAccordionBorderClass: 'border-violet-400 dark:border-violet-400/60',
    subtopicActiveClass: 'bg-white text-violet-900 font-bold border-l-2 border-violet-500 shadow-2xs dark:bg-violet-400/20 dark:text-violet-100 dark:border-violet-300',
    subtopicHoverClass: 'text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-white',
    pageBgClass: 'bg-white dark:bg-zinc-950',
    slideBadgeClass: 'bg-white text-violet-800 border border-violet-300 shadow-xs shadow-violet-500/10 dark:bg-violet-950 dark:text-violet-200 dark:border-violet-800',
    slideHeaderClass: 'text-violet-600 dark:text-violet-400',
    titleTextClass: 'text-violet-950 dark:text-violet-100',
    strongTextClass: 'text-violet-800 dark:text-violet-300',
    inlineAccentBorderClass: 'border-violet-400 dark:border-violet-500',
    bulletMarkerClass: 'text-violet-500 dark:text-violet-400',
    cardBorderClass: 'border-violet-300 shadow-md shadow-violet-500/10 dark:border-violet-900/50',
    counterBoxClass: 'border-violet-300 bg-white text-violet-900 shadow-xs shadow-violet-500/10 dark:border-violet-800 dark:bg-zinc-900 dark:text-violet-200',
    accentSurfaceClass: 'border-violet-300 bg-white shadow-xs shadow-violet-500/10 dark:border-violet-900/40 dark:bg-zinc-900',
    quoteCardClass: 'border-violet-300 bg-white shadow-lg shadow-violet-500/10 dark:border-violet-800/60 dark:bg-zinc-900',
    formulaContainerClass: 'border-violet-300 bg-white shadow-md shadow-violet-500/10 dark:border-violet-800/60 dark:bg-zinc-900',
    formulaCardClass: 'border-violet-300 bg-white text-violet-950 shadow-xs shadow-violet-500/10 dark:border-violet-800/60 dark:bg-zinc-950 dark:text-violet-100',
    formulaLabelClass: 'text-violet-700 dark:text-violet-300',
    formulaDescriptionClass: 'text-violet-800/80 dark:text-violet-300/80',
    analysisPanelClass: 'border-violet-300 bg-white text-violet-950 shadow-md shadow-violet-500/10 dark:border-violet-800/60 dark:bg-zinc-900 dark:text-violet-100',
    analysisDividerClass: 'border-violet-200 dark:border-violet-800/60',
    analysisSubcardClass: 'border-violet-300 bg-white shadow-xs shadow-violet-500/5 dark:border-violet-900/50 dark:bg-zinc-950/70',
    analysisInnerCellClass: 'border-violet-200 bg-white dark:border-violet-900/50 dark:bg-zinc-900',
    analysisAccentTextClass: 'text-violet-700 dark:text-violet-300',
    stepBadgeClass: 'bg-white text-violet-800 border border-violet-300 shadow-xs shadow-violet-500/10 dark:bg-violet-950 dark:text-violet-200 dark:border-violet-800',
    primaryButtonClass: 'bg-violet-50 text-violet-900 border border-violet-300 hover:bg-violet-100 shadow-xs shadow-violet-500/10 dark:bg-violet-900 dark:text-violet-100 dark:border-violet-700 dark:hover:bg-violet-800',
    secondaryButtonClass: 'border-violet-300 bg-white text-violet-800 hover:bg-violet-50 shadow-xs shadow-violet-500/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700',
    sliderAccentClass: 'accent-violet-600 dark:accent-violet-400',
  },
  fuchsia: {
    moduleId: 'fuchsia',
    name: 'Tema 6',
    pastelName: 'Rosa Orquídea Pastel',
    dotClass: 'bg-fuchsia-500 dark:bg-fuchsia-300',
    badgeClass: 'bg-white text-fuchsia-800 border border-fuchsia-300 dark:bg-fuchsia-900/40 dark:text-fuchsia-200 dark:border-fuchsia-500/40',
    sidebarRailActiveClass: 'bg-white text-fuchsia-950 border border-fuchsia-300 font-black shadow-xs dark:bg-fuchsia-200 dark:text-fuchsia-950 dark:border-fuchsia-300',
    sidebarActiveClass: 'bg-white text-fuchsia-950 border border-fuchsia-300 font-bold shadow-xs dark:bg-fuchsia-200 dark:text-fuchsia-950 dark:border-fuchsia-300',
    sidebarBorderClass: 'border-fuchsia-300 dark:border-fuchsia-400/40',
    sidebarAccordionBorderClass: 'border-fuchsia-400 dark:border-fuchsia-400/60',
    subtopicActiveClass: 'bg-white text-fuchsia-900 font-bold border-l-2 border-fuchsia-500 shadow-2xs dark:bg-fuchsia-400/20 dark:text-fuchsia-100 dark:border-fuchsia-300',
    subtopicHoverClass: 'text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-white',
    pageBgClass: 'bg-white dark:bg-zinc-950',
    slideBadgeClass: 'bg-white text-fuchsia-800 border border-fuchsia-300 shadow-xs shadow-fuchsia-500/10 dark:bg-fuchsia-950 dark:text-fuchsia-200 dark:border-fuchsia-800',
    slideHeaderClass: 'text-fuchsia-600 dark:text-fuchsia-400',
    titleTextClass: 'text-fuchsia-950 dark:text-fuchsia-100',
    strongTextClass: 'text-fuchsia-800 dark:text-fuchsia-300',
    inlineAccentBorderClass: 'border-fuchsia-400 dark:border-fuchsia-500',
    bulletMarkerClass: 'text-fuchsia-500 dark:text-fuchsia-400',
    cardBorderClass: 'border-fuchsia-300 shadow-md shadow-fuchsia-500/10 dark:border-fuchsia-900/50',
    counterBoxClass: 'border-fuchsia-300 bg-white text-fuchsia-900 shadow-xs shadow-fuchsia-500/10 dark:border-fuchsia-800 dark:bg-zinc-900 dark:text-fuchsia-200',
    accentSurfaceClass: 'border-fuchsia-300 bg-white shadow-xs shadow-fuchsia-500/10 dark:border-fuchsia-900/40 dark:bg-zinc-900',
    quoteCardClass: 'border-fuchsia-300 bg-white shadow-lg shadow-fuchsia-500/10 dark:border-fuchsia-800/60 dark:bg-zinc-900',
    formulaContainerClass: 'border-fuchsia-300 bg-white shadow-md shadow-fuchsia-500/10 dark:border-fuchsia-800/60 dark:bg-zinc-900',
    formulaCardClass: 'border-fuchsia-300 bg-white text-fuchsia-950 shadow-xs shadow-fuchsia-500/10 dark:border-fuchsia-800/60 dark:bg-zinc-950 dark:text-fuchsia-100',
    formulaLabelClass: 'text-fuchsia-700 dark:text-fuchsia-300',
    formulaDescriptionClass: 'text-fuchsia-800/80 dark:text-fuchsia-300/80',
    analysisPanelClass: 'border-fuchsia-300 bg-white text-fuchsia-950 shadow-md shadow-fuchsia-500/10 dark:border-fuchsia-800/60 dark:bg-zinc-900 dark:text-fuchsia-100',
    analysisDividerClass: 'border-fuchsia-200 dark:border-fuchsia-800/60',
    analysisSubcardClass: 'border-fuchsia-300 bg-white shadow-xs shadow-fuchsia-500/5 dark:border-fuchsia-900/50 dark:bg-zinc-950/70',
    analysisInnerCellClass: 'border-fuchsia-200 bg-white dark:border-fuchsia-900/50 dark:bg-zinc-900',
    analysisAccentTextClass: 'text-fuchsia-700 dark:text-fuchsia-300',
    stepBadgeClass: 'bg-white text-fuchsia-800 border border-fuchsia-300 shadow-xs shadow-fuchsia-500/10 dark:bg-fuchsia-950 dark:text-fuchsia-200 dark:border-fuchsia-800',
    primaryButtonClass: 'bg-fuchsia-50 text-fuchsia-900 border border-fuchsia-300 hover:bg-fuchsia-100 shadow-xs shadow-fuchsia-500/10 dark:bg-fuchsia-900 dark:text-fuchsia-100 dark:border-fuchsia-700 dark:hover:bg-fuchsia-800',
    secondaryButtonClass: 'border-fuchsia-300 bg-white text-fuchsia-800 hover:bg-fuchsia-50 shadow-xs shadow-fuchsia-500/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700',
    sliderAccentClass: 'accent-fuchsia-600 dark:accent-fuchsia-400',
  },
};

export const ORDERED_PALETTE_KEYS: readonly SectionThemePaletteKey[] = [
  'stone',
  'sky',
  'rose',
  'emerald',
  'amber',
  'violet',
  'fuchsia',
];

export const DEFAULT_SECTION_THEME: SectionTheme = SECTION_THEME_PALETTES.stone;

export function resolveSectionTheme(
  moduleIdOrKey: string,
  customThemeLookup?: Record<string, SectionTheme>,
): SectionTheme {
  if (customThemeLookup && customThemeLookup[moduleIdOrKey]) {
    return customThemeLookup[moduleIdOrKey];
  }
  if (moduleIdOrKey in SECTION_THEME_PALETTES) {
    return SECTION_THEME_PALETTES[moduleIdOrKey as SectionThemePaletteKey];
  }
  const indexMatch = /^(?:module-|unit-|topic-)?(\d+)/i.exec(moduleIdOrKey);
  if (indexMatch) {
    const numericIndex = Number(indexMatch[1]);
    const paletteKey = ORDERED_PALETTE_KEYS[numericIndex % ORDERED_PALETTE_KEYS.length];
    return SECTION_THEME_PALETTES[paletteKey];
  }
  return DEFAULT_SECTION_THEME;
}

export const SECTION_THEMES: Record<string, SectionTheme> = new Proxy(
  SECTION_THEME_PALETTES as Record<string, SectionTheme>,
  {
    get(_target, propertyKey) {
      return resolveSectionTheme(String(propertyKey));
    },
  },
);

export const SectionThemeContext = createContext<SectionTheme>(DEFAULT_SECTION_THEME);

export function useSectionTheme(): SectionTheme {
  return useContext(SectionThemeContext);
}

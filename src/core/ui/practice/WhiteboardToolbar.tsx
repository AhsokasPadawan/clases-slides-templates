import { ComponentType } from 'react';
import { Circle, Download, Eraser, Minus, MoveRight, Pencil, RotateCcw, RotateCw, Square, Trash2 } from 'lucide-react';
import { WhiteboardTool } from '../../domain/studyPreferencesStorage';

export interface WhiteboardToolbarProps {
  selectedTool: WhiteboardTool;
  selectedColor: string;
  selectedStrokeWidth: number;
  canUndo: boolean;
  canRedo: boolean;
  canClear: boolean;
  onSelectTool: (tool: WhiteboardTool) => void;
  onSelectColor: (color: string) => void;
  onSelectStrokeWidth: (strokeWidth: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onDownload: () => void;
}

const ORDERED_TOOLS: readonly WhiteboardTool[] = ['pencil', 'rectangle', 'circle', 'arrow', 'line', 'eraser'];

const TOOL_ICONS: Record<WhiteboardTool, ComponentType<{ className?: string }>> = {
  pencil: Pencil,
  rectangle: Square,
  circle: Circle,
  arrow: MoveRight,
  line: Minus,
  eraser: Eraser,
};

const TOOL_LABELS: Record<WhiteboardTool, string> = {
  pencil: 'Lápiz libre',
  rectangle: 'Rectángulo',
  circle: 'Círculo / Nodo',
  arrow: 'Flecha / Arista dirigida',
  line: 'Línea',
  eraser: 'Borrador',
};

const COLOR_PALETTE = [
  { value: '#34d399', name: 'Esmeralda' },
  { value: '#fbbf24', name: 'Ámbar' },
  { value: '#38bdf8', name: 'Cian' },
  { value: '#f87171', name: 'Coral' },
  { value: '#a78bfa', name: 'Púrpura' },
  { value: '#f4f4f5', name: 'Blanco' },
] as const;

const STROKE_WIDTH_OPTIONS = [
  { value: 2, label: 'Fino' },
  { value: 4, label: 'Medio' },
  { value: 8, label: 'Grueso' },
] as const;

export function WhiteboardToolbar({
  selectedTool,
  selectedColor,
  selectedStrokeWidth,
  canUndo,
  canRedo,
  canClear,
  onSelectTool,
  onSelectColor,
  onSelectStrokeWidth,
  onUndo,
  onRedo,
  onClear,
  onDownload,
}: WhiteboardToolbarProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/90 px-3 py-2">
      <div className="flex flex-wrap items-center gap-1.5" role="toolbar" aria-label="Herramientas de dibujo">
        {ORDERED_TOOLS.map((toolName) => {
          const ToolIcon = TOOL_ICONS[toolName];
          const isSelected = selectedTool === toolName;
          return (
            <button
              key={toolName}
              type="button"
              aria-pressed={isSelected}
              aria-label={TOOL_LABELS[toolName]}
              title={TOOL_LABELS[toolName]}
              onClick={() => onSelectTool(toolName)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                isSelected
                  ? 'border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-300'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <ToolIcon className="h-4 w-4" />
            </button>
          );
        })}

        <div className="mx-1 h-5 w-px bg-zinc-800" />

        <div className="flex items-center gap-1" role="group" aria-label="Selector de color">
          {COLOR_PALETTE.map((paletteColor) => (
            <button
              key={paletteColor.value}
              type="button"
              aria-label={`Color ${paletteColor.name}`}
              title={paletteColor.name}
              onClick={() => onSelectColor(paletteColor.value)}
              className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
                selectedColor === paletteColor.value
                  ? 'border-white ring-2 ring-fuchsia-500/80 scale-110'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: paletteColor.value }}
            />
          ))}
        </div>

        <div className="mx-1 h-5 w-px bg-zinc-800" />

        <div className="flex items-center gap-1" role="group" aria-label="Grosor de trazo">
          {STROKE_WIDTH_OPTIONS.map((strokeOption) => (
            <button
              key={strokeOption.value}
              type="button"
              aria-label={`Grosor ${strokeOption.label}`}
              title={`Grosor: ${strokeOption.label}`}
              onClick={() => onSelectStrokeWidth(strokeOption.value)}
              className={`flex h-7 px-2 items-center justify-center rounded-md text-xs font-semibold border transition ${
                selectedStrokeWidth === strokeOption.value
                  ? 'border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-300'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {strokeOption.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5" role="group" aria-label="Acciones del pizarrón">
        <button type="button" onClick={onUndo} disabled={!canUndo} aria-label="Deshacer trazo" title="Deshacer trazo" className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-zinc-700 hover:text-white disabled:opacity-30">
          <RotateCcw className="h-4 w-4" />
        </button>
        <button type="button" onClick={onRedo} disabled={!canRedo} aria-label="Rehacer trazo" title="Rehacer trazo" className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-zinc-700 hover:text-white disabled:opacity-30">
          <RotateCw className="h-4 w-4" />
        </button>
        <button type="button" onClick={onClear} disabled={!canClear} aria-label="Limpiar pizarrón" title="Limpiar pizarrón" className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:bg-red-950/60 hover:text-red-300 disabled:opacity-30">
          <Trash2 className="h-4 w-4" />
        </button>
        <button type="button" onClick={onDownload} aria-label="Descargar pizarrón como imagen PNG" title="Descargar como imagen PNG" className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-fuchsia-600 hover:text-fuchsia-300">
          <Download className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

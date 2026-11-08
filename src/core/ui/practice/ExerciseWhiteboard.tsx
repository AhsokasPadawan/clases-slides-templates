import { useEffect, useRef, useState } from 'react';
import {
  loadExerciseWhiteboard,
  saveExerciseWhiteboard,
  WhiteboardElement,
  WhiteboardPoint,
  WhiteboardTool,
} from '../../domain/studyPreferencesStorage';
import {
  createWhiteboardElement,
  renderWhiteboardScene,
  updateWhiteboardElement,
} from './whiteboardCanvasRenderer';
import { WhiteboardToolbar } from './WhiteboardToolbar';

export interface ExerciseWhiteboardProps {
  exerciseId: string;
  exerciseTitle: string;
}

export function ExerciseWhiteboard({
  exerciseId,
  exerciseTitle,
}: ExerciseWhiteboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [elements, setElements] = useState<WhiteboardElement[]>(() =>
    loadExerciseWhiteboard(exerciseId),
  );
  const [redoStack, setRedoStack] = useState<WhiteboardElement[][]>([]);
  const [selectedTool, setSelectedTool] = useState<WhiteboardTool>('pencil');
  const [selectedColor, setSelectedColor] = useState<string>('#34d399');
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState<number>(4);
  const [activeDrawingElement, setActiveDrawingElement] =
    useState<WhiteboardElement | null>(null);
  const isDrawingRef = useRef(false);

  const redrawCanvas = (overrideActiveElement?: WhiteboardElement | null) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const targetWidth = Math.floor(rect.width);
    const targetHeight = Math.floor(rect.height);
    if (targetWidth === 0 || targetHeight === 0) return;

    if (canvas.width !== targetWidth * dpr || canvas.height !== targetHeight * dpr) {
      canvas.width = targetWidth * dpr;
      canvas.height = targetHeight * dpr;
      canvas.style.width = `${targetWidth}px`;
      canvas.style.height = `${targetHeight}px`;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderWhiteboardScene(
      ctx,
      targetWidth,
      targetHeight,
      elements,
      overrideActiveElement !== undefined ? overrideActiveElement : activeDrawingElement,
    );
  };

  useEffect(() => {
    redrawCanvas();
    const handleResize = () => redrawCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [elements, activeDrawingElement]);

  const getCanvasPointerPosition = (
    event: React.PointerEvent<HTMLCanvasElement>,
  ): WhiteboardPoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.round(event.clientX - rect.left),
      y: Math.round(event.clientY - rect.top),
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.button !== 0) return;
    isDrawingRef.current = true;
    const newElement = createWhiteboardElement(
      `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      selectedTool,
      selectedColor,
      selectedStrokeWidth,
      getCanvasPointerPosition(event),
    );
    setActiveDrawingElement(newElement);
    redrawCanvas(newElement);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !activeDrawingElement) return;
    const updatedElement = updateWhiteboardElement(
      activeDrawingElement,
      getCanvasPointerPosition(event),
    );
    setActiveDrawingElement(updatedElement);
    redrawCanvas(updatedElement);
  };

  const finalizeDrawing = () => {
    if (!isDrawingRef.current || !activeDrawingElement) return;
    isDrawingRef.current = false;
    const nextElements = [...elements, activeDrawingElement];
    setElements(nextElements);
    setActiveDrawingElement(null);
    setRedoStack([]);
    saveExerciseWhiteboard(exerciseId, nextElements);
    redrawCanvas(null);
  };

  const handleUndo = () => {
    if (elements.length === 0) return;
    const nextElements = elements.slice(0, -1);
    setRedoStack([[elements[elements.length - 1]], ...redoStack]);
    setElements(nextElements);
    saveExerciseWhiteboard(exerciseId, nextElements);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const [redoBatch, ...remainingRedo] = redoStack;
    const nextElements = [...elements, ...redoBatch];
    setRedoStack(remainingRedo);
    setElements(nextElements);
    saveExerciseWhiteboard(exerciseId, nextElements);
  };

  const handleClear = () => {
    if (elements.length === 0) return;
    setRedoStack([elements, ...redoStack]);
    setElements([]);
    saveExerciseWhiteboard(exerciseId, []);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const anchor = document.createElement('a');
    anchor.download = `pizarron-${exerciseId}.png`;
    anchor.href = canvas.toDataURL('image/png');
    anchor.click();
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      <WhiteboardToolbar
        selectedTool={selectedTool}
        selectedColor={selectedColor}
        selectedStrokeWidth={selectedStrokeWidth}
        canUndo={elements.length > 0}
        canRedo={redoStack.length > 0}
        canClear={elements.length > 0}
        onSelectTool={setSelectedTool}
        onSelectColor={setSelectedColor}
        onSelectStrokeWidth={setSelectedStrokeWidth}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onDownload={handleDownload}
      />

      <div ref={containerRef} className="relative flex-1 min-h-0 w-full overflow-hidden select-none cursor-crosshair bg-zinc-950">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Pizarrón para bocetar ${exerciseTitle}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finalizeDrawing}
          onPointerLeave={finalizeDrawing}
          className="touch-none absolute inset-0 block h-full w-full"
        />
      </div>
    </div>
  );
}

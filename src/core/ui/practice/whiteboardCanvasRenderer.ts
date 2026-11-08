import {
  WhiteboardElement,
  WhiteboardPoint,
  WhiteboardTool,
} from '../../domain/studyPreferencesStorage';

function drawPencilStroke(ctx: CanvasRenderingContext2D, element: WhiteboardElement) {
  const points = element.points ?? [];
  if (points.length === 0) return;
  ctx.strokeStyle = element.color;
  ctx.lineWidth = element.strokeWidth;

  if (points.length === 1) {
    ctx.fillStyle = element.color;
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, element.strokeWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length - 1; index += 1) {
    const midX = (points[index].x + points[index + 1].x) / 2;
    const midY = (points[index].y + points[index + 1].y) / 2;
    ctx.quadraticCurveTo(points[index].x, points[index].y, midX, midY);
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.stroke();
}

function drawEraserStroke(ctx: CanvasRenderingContext2D, element: WhiteboardElement) {
  const points = element.points ?? [];
  if (points.length === 0) return;
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = element.strokeWidth * 4;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    ctx.lineTo(points[index].x, points[index].y);
  }
  ctx.stroke();
}

function drawRectangle(ctx: CanvasRenderingContext2D, element: WhiteboardElement) {
  const startX = element.startX ?? 0;
  const startY = element.startY ?? 0;
  const endX = element.endX ?? 0;
  const endY = element.endY ?? 0;
  ctx.strokeStyle = element.color;
  ctx.lineWidth = element.strokeWidth;
  ctx.beginPath();
  ctx.rect(Math.min(startX, endX), Math.min(startY, endY), Math.abs(endX - startX), Math.abs(endY - startY));
  ctx.stroke();
}

function drawCircle(ctx: CanvasRenderingContext2D, element: WhiteboardElement) {
  const startX = element.startX ?? 0;
  const startY = element.startY ?? 0;
  const endX = element.endX ?? 0;
  const endY = element.endY ?? 0;
  ctx.strokeStyle = element.color;
  ctx.lineWidth = element.strokeWidth;
  ctx.beginPath();
  ctx.ellipse(
    (startX + endX) / 2,
    (startY + endY) / 2,
    Math.max(Math.abs(endX - startX) / 2, 1),
    Math.max(Math.abs(endY - startY) / 2, 1),
    0,
    0,
    Math.PI * 2,
  );
  ctx.stroke();
}

function drawLine(ctx: CanvasRenderingContext2D, element: WhiteboardElement) {
  ctx.strokeStyle = element.color;
  ctx.lineWidth = element.strokeWidth;
  ctx.beginPath();
  ctx.moveTo(element.startX ?? 0, element.startY ?? 0);
  ctx.lineTo(element.endX ?? 0, element.endY ?? 0);
  ctx.stroke();
}

function drawArrow(ctx: CanvasRenderingContext2D, element: WhiteboardElement) {
  const startX = element.startX ?? 0;
  const startY = element.startY ?? 0;
  const endX = element.endX ?? 0;
  const endY = element.endY ?? 0;
  ctx.strokeStyle = element.color;
  ctx.lineWidth = element.strokeWidth;
  ctx.fillStyle = element.color;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  const angle = Math.atan2(endY - startY, endX - startX);
  const headLength = Math.max(element.strokeWidth * 3.5, 12);
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

export const ELEMENT_DRAWERS: Record<
  WhiteboardTool,
  (ctx: CanvasRenderingContext2D, element: WhiteboardElement) => void
> = {
  pencil: drawPencilStroke,
  eraser: drawEraserStroke,
  rectangle: drawRectangle,
  circle: drawCircle,
  arrow: drawArrow,
  line: drawLine,
};

const FREEHAND_TOOLS = new Set<WhiteboardTool>(['pencil', 'eraser']);

export function createWhiteboardElement(
  id: string,
  tool: WhiteboardTool,
  color: string,
  strokeWidth: number,
  startPoint: WhiteboardPoint,
): WhiteboardElement {
  if (FREEHAND_TOOLS.has(tool)) {
    return { id, tool, color, strokeWidth, points: [startPoint] };
  }
  return {
    id,
    tool,
    color,
    strokeWidth,
    startX: startPoint.x,
    startY: startPoint.y,
    endX: startPoint.x,
    endY: startPoint.y,
  };
}

export function updateWhiteboardElement(
  element: WhiteboardElement,
  nextPoint: WhiteboardPoint,
): WhiteboardElement {
  if (FREEHAND_TOOLS.has(element.tool)) {
    return { ...element, points: [...(element.points ?? []), nextPoint] };
  }
  return { ...element, endX: nextPoint.x, endY: nextPoint.y };
}

export function renderWhiteboardScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  elements: readonly WhiteboardElement[],
  activeElement: WhiteboardElement | null,
) {
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(52, 211, 153, 0.08)';
  for (let posX = 24; posX < width; posX += 24) {
    for (let posY = 24; posY < height; posY += 24) {
      ctx.beginPath();
      ctx.arc(posX, posY, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const element of elements) {
    ELEMENT_DRAWERS[element.tool](ctx, element);
  }
  if (activeElement) {
    ELEMENT_DRAWERS[activeElement.tool](ctx, activeElement);
  }
}

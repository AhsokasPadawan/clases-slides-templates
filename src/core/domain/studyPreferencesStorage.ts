import { ThemeMode } from './coreTypes';

const DEFAULT_STORAGE_NAMESPACE = 'study-platform';

function readStorageValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageValue(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

export function loadCompletedItemIds(
  namespace: string = DEFAULT_STORAGE_NAMESPACE,
): string[] {
  const storedValue = readStorageValue(`${namespace}:completed-items`);
  if (!storedValue) {
    return [];
  }
  try {
    const parsedValue: unknown = JSON.parse(storedValue);
    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

export function saveCompletedItemIds(
  completedItemIds: string[],
  namespace: string = DEFAULT_STORAGE_NAMESPACE,
): void {
  writeStorageValue(
    `${namespace}:completed-items`,
    JSON.stringify(completedItemIds),
  );
}

export function loadThemeMode(
  namespace: string = DEFAULT_STORAGE_NAMESPACE,
): ThemeMode {
  return readStorageValue(`${namespace}:theme-mode`) === 'emerald-night'
    ? 'emerald-night'
    : 'emerald-light';
}

export function saveThemeMode(
  themeMode: ThemeMode,
  namespace: string = DEFAULT_STORAGE_NAMESPACE,
): void {
  writeStorageValue(`${namespace}:theme-mode`, themeMode);
}

export interface ExerciseUserDraft {
  pseudocode: string;
  code: string;
}

export function loadExerciseUserDraft(
  exerciseId: string,
  namespace: string = DEFAULT_STORAGE_NAMESPACE,
): ExerciseUserDraft {
  const storedValue = readStorageValue(
    `${namespace}:exercise-draft:${exerciseId}`,
  );
  if (!storedValue) {
    return { pseudocode: '', code: '' };
  }
  try {
    const parsedValue = JSON.parse(storedValue) as Partial<ExerciseUserDraft>;
    return {
      pseudocode:
        typeof parsedValue.pseudocode === 'string' ? parsedValue.pseudocode : '',
      code: typeof parsedValue.code === 'string' ? parsedValue.code : '',
    };
  } catch {
    return { pseudocode: '', code: '' };
  }
}

export function saveExerciseUserDraft(
  exerciseId: string,
  draft: ExerciseUserDraft,
  namespace: string = DEFAULT_STORAGE_NAMESPACE,
): void {
  writeStorageValue(
    `${namespace}:exercise-draft:${exerciseId}`,
    JSON.stringify(draft),
  );
}

export function loadSidebarCollapsedPreference(
  namespace: string = DEFAULT_STORAGE_NAMESPACE,
): boolean {
  return readStorageValue(`${namespace}:sidebar-collapsed`) === 'true';
}

export function saveSidebarCollapsedPreference(
  isCollapsed: boolean,
  namespace: string = DEFAULT_STORAGE_NAMESPACE,
): void {
  writeStorageValue(`${namespace}:sidebar-collapsed`, String(isCollapsed));
}

export type WhiteboardTool =
  | 'pencil'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'line'
  | 'eraser';

export interface WhiteboardPoint {
  x: number;
  y: number;
}

export interface WhiteboardElement {
  id: string;
  tool: WhiteboardTool;
  color: string;
  strokeWidth: number;
  points?: WhiteboardPoint[];
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
}

export function loadExerciseWhiteboard(
  exerciseId: string,
  namespace: string = DEFAULT_STORAGE_NAMESPACE,
): WhiteboardElement[] {
  const storedValue = readStorageValue(
    `${namespace}:whiteboard:${exerciseId}`,
  );
  if (!storedValue) {
    return [];
  }
  try {
    const parsedValue: unknown = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? (parsedValue as WhiteboardElement[]) : [];
  } catch {
    return [];
  }
}

export function saveExerciseWhiteboard(
  exerciseId: string,
  elements: WhiteboardElement[],
  namespace: string = DEFAULT_STORAGE_NAMESPACE,
): void {
  writeStorageValue(
    `${namespace}:whiteboard:${exerciseId}`,
    JSON.stringify(elements),
  );
}

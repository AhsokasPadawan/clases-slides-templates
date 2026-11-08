import { beforeEach, describe, expect, it } from 'vitest';
import {
  loadCompletedItemIds,
  loadExerciseUserDraft,
  loadExerciseWhiteboard,
  loadSidebarCollapsedPreference,
  loadThemeMode,
  saveCompletedItemIds,
  saveExerciseUserDraft,
  saveExerciseWhiteboard,
  saveSidebarCollapsedPreference,
  saveThemeMode,
  WhiteboardElement,
} from './studyPreferencesStorage';

beforeEach(() => {
  localStorage.clear();
});

describe('studyPreferencesStorage', () => {
  it('persists and loads completed item identifiers', () => {
    const expectedIds = ['unit-1', 'ex-42'];

    saveCompletedItemIds(expectedIds);
    const loadedIds = loadCompletedItemIds();

    expect(loadedIds).toEqual(expectedIds);
  });

  it('defaults to emerald-light theme and persists emerald-night selection', () => {
    const initialTheme = loadThemeMode();

    saveThemeMode('emerald-night');
    const updatedTheme = loadThemeMode();

    expect(initialTheme).toBe('emerald-light');
    expect(updatedTheme).toBe('emerald-night');
  });

  it('persists sidebar collapsed preference across sessions', () => {
    const initialPreference = loadSidebarCollapsedPreference();

    saveSidebarCollapsedPreference(true);
    const updatedPreference = loadSidebarCollapsedPreference();

    expect(initialPreference).toBe(false);
    expect(updatedPreference).toBe(true);
  });

  it('persists exercise drafts and whiteboard strokes per exercise identifier', () => {
    const exerciseId = 'synthetic-ex-1';
    const draft = {
      pseudocode: 'Paso 1: plantear ecuación',
      code: 'const result = 42;',
    };
    const whiteboardElements: WhiteboardElement[] = [
      {
        id: 'stroke-1',
        tool: 'rectangle',
        color: '#34d399',
        strokeWidth: 4,
        startX: 10,
        startY: 20,
        endX: 100,
        endY: 80,
      },
    ];

    saveExerciseUserDraft(exerciseId, draft);
    saveExerciseWhiteboard(exerciseId, whiteboardElements);
    const loadedDraft = loadExerciseUserDraft(exerciseId);
    const loadedElements = loadExerciseWhiteboard(exerciseId);

    expect(loadedDraft).toEqual(draft);
    expect(loadedElements).toEqual(whiteboardElements);
  });
});

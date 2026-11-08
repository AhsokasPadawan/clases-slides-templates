import { useState } from 'react';

export interface VisualizerPlaybackController<TFrame> {
  currentStep: number;
  currentFrame: TFrame;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number;
  setCurrentStep: (step: number) => void;
  togglePlay: () => void;
  setPlaybackSpeed: (speed: number) => void;
  resetPlayback: () => void;
}

export function useVisualizerPlayback<TFrame>(
  frames: readonly TFrame[],
): VisualizerPlaybackController<TFrame> {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const safeStep = Math.min(currentStep, Math.max(0, frames.length - 1));
  const currentFrame = frames[safeStep] ?? frames[0];

  const togglePlay = () => {
    setIsPlaying((previous) => !previous);
  };

  const resetPlayback = () => {
    setCurrentStep(0);
  };

  return {
    currentStep: safeStep,
    currentFrame,
    totalSteps: frames.length,
    isPlaying,
    playbackSpeed,
    setCurrentStep,
    togglePlay,
    setPlaybackSpeed,
    resetPlayback,
  };
}

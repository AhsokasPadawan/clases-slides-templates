import { AnimationPlayerShell } from '../../core/ui/AnimationPlayerShell';
import { useVisualizerPlayback } from './shared/useVisualizerPlayback';
import { VisualizerMetricCard } from './shared/VisualizerMetricSubcards';

interface ExtractionFrame {
  readonly stepNumber: number;
  readonly stageTitle: string;
  readonly timeLabel: string;
  readonly waterWeight: number;
  readonly totalWeight: number;
  readonly waterTemperature: number;
  readonly flowRate: string;
  readonly tdsPercent: string;
  readonly extractionYield: string;
  readonly waterFillPercent: number;
  readonly liquidInServerPercent: number;
  readonly isDripping: boolean;
  readonly bedStatus: string;
  readonly description: string;
}

const V60_EXTRACTION_FRAMES: readonly ExtractionFrame[] = [
  {
    stepNumber: 0,
    stageTitle: '0. Purgado y Pre-calentamiento',
    timeLabel: '00:00',
    waterWeight: 0,
    totalWeight: 0,
    waterTemperature: 94,
    flowRate: '0.0 g/s',
    tdsPercent: '0.00%',
    extractionYield: '0.00%',
    waterFillPercent: 0,
    liquidInServerPercent: 0,
    isDripping: false,
    bedStatus: 'Filtro húmedo sin residuos de celulosa',
    description:
      'Se enjuaga el filtro de papel cónico con 100 ml de agua caliente a 94°C para eliminar notas de celulosa y aclimatar la jarra de borosilicato. Luego se descarta el agua del servidor.',
  },
  {
    stepNumber: 1,
    stageTitle: '1. Carga de Molienda (15.0 g)',
    timeLabel: '00:00',
    waterWeight: 0,
    totalWeight: 15,
    waterTemperature: 93,
    flowRate: '0.0 g/s',
    tdsPercent: '0.00%',
    extractionYield: '0.00%',
    waterFillPercent: 0,
    liquidInServerPercent: 0,
    isDripping: false,
    bedStatus: 'Cama seca homogénea (600 µm)',
    description:
      'Se incorporan 15.0 g de café de especialidad con molienda media-fina (600 µm). Se nivela suavemente la superficie y se realiza un pequeño pocillo central para optimizar la pre-infusión.',
  },
  {
    stepNumber: 2,
    stageTitle: '2. The Bloom (Floración y CO₂)',
    timeLabel: '00:45',
    waterWeight: 45,
    totalWeight: 60,
    waterTemperature: 93,
    flowRate: '1.2 g/s',
    tdsPercent: '0.25%',
    extractionYield: '3.10%',
    waterFillPercent: 25,
    liquidInServerPercent: 8,
    isDripping: true,
    bedStatus: 'Desgasificación activa de burbujas',
    description:
      'Se vierten 45 g de agua en espiral suave (ratio 1:3 respecto al café) y se espera 45 segundos. Los gases de dióxido de carbono escapan en burbujas, desbloqueando los canales hidrofílicos.',
  },
  {
    stepNumber: 3,
    stageTitle: '3. Primer Vertido Espiral (hasta 140 g)',
    timeLabel: '01:15',
    waterWeight: 140,
    totalWeight: 155,
    waterTemperature: 92,
    flowRate: '4.5 g/s',
    tdsPercent: '0.95%',
    extractionYield: '11.80%',
    waterFillPercent: 65,
    liquidInServerPercent: 40,
    isDripping: true,
    bedStatus: 'Turbulencia controlada en espiral',
    description:
      'Vertido continuo concéntrico desde el centro hacia afuera sin mojar las paredes del filtro de papel. La columna de agua mantiene la temperatura constante y disuelve los compuestos aromáticos más volátiles.',
  },
  {
    stepNumber: 4,
    stageTitle: '4. Segundo Vertido y Swirl (hasta 240 g)',
    timeLabel: '01:45',
    waterWeight: 240,
    totalWeight: 255,
    waterTemperature: 91,
    flowRate: '3.8 g/s',
    tdsPercent: '1.28%',
    extractionYield: '17.20%',
    waterFillPercent: 90,
    liquidInServerPercent: 70,
    isDripping: true,
    bedStatus: 'Suave agitación circular (swirl)',
    description:
      'Se completa el vertido hasta los 240 g totales de agua (ratio 1:16). Se imprime un suave giro manual al dripper para lavar las partículas adheridas a las paredes y nivelar la cama de café.',
  },
  {
    stepNumber: 5,
    stageTitle: '5. Drawdown y Taza Final (Golden Cup)',
    timeLabel: '02:45',
    waterWeight: 240,
    totalWeight: 229,
    waterTemperature: 86,
    flowRate: '0.0 g/s',
    tdsPercent: '1.38%',
    extractionYield: '19.69%',
    waterFillPercent: 0,
    liquidInServerPercent: 100,
    isDripping: false,
    bedStatus: 'Cama plana horizontal perfecta',
    description:
      'Filtrado por gravedad completado en 2:45 min. La borra retiene aproximadamente el doble de su peso en agua, entregando 214 g de café líquido limpio con TDS de 1.38% y un Extraction Yield del 19.69%.',
  },
];

export function V60ExtractionVisualizer() {
  const {
    currentStep,
    currentFrame,
    totalSteps,
    isPlaying,
    playbackSpeed,
    setCurrentStep,
    togglePlay,
    setPlaybackSpeed,
    resetPlayback,
  } = useVisualizerPlayback(V60_EXTRACTION_FRAMES);

  return (
    <AnimationPlayerShell
      title="Simulador de Extracción Hario V60 (Receta Hoffmann / Rao)"
      badge="Specialty Coffee Dripper"
      currentStep={currentStep}
      totalSteps={totalSteps}
      isPlaying={isPlaying}
      playbackSpeed={playbackSpeed}
      stepDescription={currentFrame.description}
      onStepChange={setCurrentStep}
      onTogglePlay={togglePlay}
      onSpeedChange={setPlaybackSpeed}
      onReset={resetPlayback}
    >
      <div className="flex-1 min-h-0 w-full flex flex-col lg:flex-row items-stretch justify-between gap-3 sm:gap-4">
        <div className="w-full lg:w-80 shrink-0 flex flex-col justify-between gap-2">
          <VisualizerMetricCard
            label="Fase Activa"
            value={currentFrame.stageTitle}
            valueClassName="text-amber-300 font-bold"
          />
          <div className="grid grid-cols-2 gap-2">
            <VisualizerMetricCard
              label="Tiempo Cronómetro"
              value={currentFrame.timeLabel}
              valueClassName="text-emerald-400 font-mono"
            />
            <VisualizerMetricCard
              label="Agua en Balanza"
              value={`${currentFrame.waterWeight} g / 240 g`}
              valueClassName="text-sky-300 font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <VisualizerMetricCard
              label="Temp. Caldera"
              value={`${currentFrame.waterTemperature} °C`}
              valueClassName="text-rose-400 font-mono"
            />
            <VisualizerMetricCard
              label="Caudal de Vertido"
              value={currentFrame.flowRate}
              valueClassName="text-amber-200 font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <VisualizerMetricCard
              label="TDS Refractómetro"
              value={currentFrame.tdsPercent}
              valueClassName="text-purple-300 font-mono"
            />
            <VisualizerMetricCard
              label="Extraction Yield (EY)"
              value={currentFrame.extractionYield}
              valueClassName="text-emerald-300 font-mono"
            />
          </div>
          <VisualizerMetricCard
            label="Estado del Lecho de Café"
            value={currentFrame.bedStatus}
            valueClassName="text-zinc-300 text-xs"
          />
        </div>

        <div className="flex-1 min-w-0 min-h-0 h-full flex flex-col items-center justify-center rounded-2xl border border-amber-950/40 bg-zinc-950/90 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="w-full max-w-md flex flex-col items-center">
            <div className="relative w-64 h-48 flex items-center justify-center">
              <svg viewBox="0 0 200 150" className="w-full h-full drop-shadow-md">
                <polygon
                  points="30,20 170,20 120,110 80,110"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <line x1="50" y1="20" x2="90" y2="105" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />
                <line x1="75" y1="20" x2="97" y2="105" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />
                <line x1="100" y1="20" x2="100" y2="105" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />
                <line x1="125" y1="20" x2="103" y2="105" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />
                <line x1="150" y1="20" x2="110" y2="105" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />

                <polygon
                  points="45,28 155,28 115,100 85,100"
                  fill="#fef3c7"
                  fillOpacity="0.15"
                  stroke="#fef3c7"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />

                {currentFrame.totalWeight > 0 && (
                  <polygon
                    points="70,75 130,75 112,98 88,98"
                    fill="#78350f"
                    fillOpacity="0.85"
                  />
                )}

                {currentFrame.waterFillPercent > 0 && (
                  <polygon
                    points={`
                      ${80 - currentFrame.waterFillPercent * 0.3},${75 - currentFrame.waterFillPercent * 0.4}
                      ${120 + currentFrame.waterFillPercent * 0.3},${75 - currentFrame.waterFillPercent * 0.4}
                      130,75 70,75
                    `}
                    fill="#d97706"
                    fillOpacity="0.5"
                  />
                )}

                {currentFrame.isDripping && (
                  <g className="animate-pulse">
                    <circle cx="100" cy="120" r="3" fill="#b45309" />
                    <circle cx="100" cy="132" r="2.5" fill="#d97706" />
                    <circle cx="100" cy="142" r="2" fill="#f59e0b" />
                  </g>
                )}
              </svg>
            </div>

            <div className="relative w-56 h-36 -mt-3 flex items-center justify-center">
              <svg viewBox="0 0 160 110" className="w-full h-full drop-shadow-md">
                <path
                  d="M 50,10 L 110,10 L 125,75 Q 125,95 105,95 L 55,95 Q 35,95 35,75 Z"
                  fill="#18181b"
                  fillOpacity="0.6"
                  stroke="#71717a"
                  strokeWidth="2.5"
                />
                <path
                  d="M 115,25 Q 145,25 145,55 Q 145,85 115,85"
                  fill="none"
                  stroke="#71717a"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {currentFrame.liquidInServerPercent > 0 && (
                  <path
                    d={`
                      M 38,${85 - currentFrame.liquidInServerPercent * 0.45}
                      L 122,${85 - currentFrame.liquidInServerPercent * 0.45}
                      L 122,75 Q 122,92 105,92 L 55,92 Q 38,92 38,75 Z
                    `}
                    fill="#92400e"
                    fillOpacity="0.75"
                  />
                )}

                <line x1="50" y1="40" x2="65" y2="40" stroke="#a1a1aa" strokeWidth="1" strokeOpacity="0.4" />
                <line x1="50" y1="60" x2="70" y2="60" stroke="#a1a1aa" strokeWidth="1" strokeOpacity="0.4" />
                <line x1="50" y1="80" x2="65" y2="80" stroke="#a1a1aa" strokeWidth="1" strokeOpacity="0.4" />
              </svg>
            </div>

            <div className="w-64 rounded-xl border border-zinc-700 bg-zinc-900/90 p-2.5 flex items-center justify-between shadow-lg mt-1 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-zinc-400 font-sans font-bold tracking-wider">
                  Balanza Digital
                </span>
                <span className="text-lg font-bold text-emerald-400">
                  {currentFrame.waterWeight}.0 g
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase text-zinc-400 font-sans font-bold tracking-wider">
                  Timer
                </span>
                <span className="text-base font-bold text-amber-300">
                  {currentFrame.timeLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimationPlayerShell>
  );
}

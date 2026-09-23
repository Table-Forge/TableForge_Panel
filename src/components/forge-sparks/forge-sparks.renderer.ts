import type { IForgeSparksPalette } from "./forge-sparks.interfaces";

type TSparkKind = "spark" | "ember" | "mote";
type TRange = readonly [number, number];
type TRgb = readonly [number, number, number];
type TGlowStop = readonly [offset: number, alpha: number, tone: "core" | "halo"];

interface ISparkPreset {
  speed: TRange;
  spread: number;
  heat: TRange;
  life: TRange;
  size: TRange;
  drag: TRange;
  gravity: number;
  lift: number;
  flicker: number;
  opacity: number;
  glow: number;
  streak: number;
}

interface ISpark {
  kind: TSparkKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  initialHeat: number;
  drag: number;
  flickerRate: number;
  flickerPhase: number;
}

interface IFlare {
  x: number;
  age: number;
}

interface IForgeSparksRenderer {
  resize: (width: number, height: number, pixelRatio: number) => void;
  render: (delta: number) => void;
}

const UPWARD = -Math.PI / 2;
const HEARTH_MAX_WIDTH = 1024;
const HEARTH_SPREAD = 0.85;
const EMISSION_PER_PIXEL = 0.036;
const SPARK_SHARE = 0.3;
const MOTE_SHARE = 0.05;
const MAX_SPARKS = 240;
const RISE_SPEED = 110;
const COOLING = 1.6;
const FADE_IN_SECONDS = 0.05;
const TOP_FADE_DISTANCE = 90;
const FLICKER_RATE: TRange = [12, 40];
const FLICKER_HARMONIC = 2.3;
const BURST_INTERVAL: TRange = [0.5, 2.4];
const BURST_COUNT: TRange = [4, 10];
const BURST_SPEED: TRange = [220, 460];
const BURST_SPREAD = 0.55;
const BURST_SCATTER = 6;
const FLARE_SECONDS = 0.35;
const FLARE_RADIUS = 26;
const FLARE_OPACITY = 0.55;
const HEARTH_GLOW_HEIGHT = 34;
const HEARTH_GLOW_BASE = 0.14;
const HEARTH_GLOW_FLICKER = 0.07;
const HEARTH_GLOW_FLARE = 0.1;
const HEARTH_FLICKER_RATE = 7.3;
const WARM_UP_STEPS = 60;
const WARM_UP_DELTA = 1 / 30;
const SPRITE_SIZE = 32;
const SPRITE_STEPS = 24;
const CORE_HEAT_BOOST = 0.35;
const SHARP_GLOW: TGlowStop[] = [
  [0, 1, "core"],
  [0.18, 1, "core"],
  [0.3, 0.55, "halo"],
  [0.5, 0.16, "halo"],
  [0.75, 0.04, "halo"],
  [1, 0, "halo"],
];
const SOFT_GLOW: TGlowStop[] = [
  [0, 0.5, "halo"],
  [0.5, 0.38, "halo"],
  [0.78, 0.12, "halo"],
  [1, 0, "halo"],
];

const EDDIES = [
  { frequency: 0.011, drift: 0.5, strength: 50, phase: 0 },
  { frequency: 0.027, drift: 1.1, strength: 22, phase: 1.7 },
  { frequency: 0.063, drift: 2.3, strength: 10, phase: 4.1 },
];

const PRESETS: Record<TSparkKind, ISparkPreset> = {
  spark: {
    speed: [180, 380],
    spread: 0.3,
    heat: [0.85, 1],
    life: [0.7, 1.5],
    size: [0.9, 1.6],
    drag: [0.9, 1.4],
    gravity: 40,
    lift: 0,
    flicker: 0.3,
    opacity: 1,
    glow: 4,
    streak: 0.045,
  },
  ember: {
    speed: [50, 130],
    spread: 0.5,
    heat: [0.6, 0.92],
    life: [2, 4],
    size: [0.9, 2],
    drag: [2.2, 3.4],
    gravity: 0,
    lift: 24,
    flicker: 0.45,
    opacity: 1,
    glow: 4,
    streak: 0.04,
  },
  mote: {
    speed: [40, 80],
    spread: 0.4,
    heat: [0.5, 0.8],
    life: [2.6, 4.4],
    size: [3, 5.5],
    drag: [1.4, 2.2],
    gravity: 0,
    lift: 16,
    flicker: 0.15,
    opacity: 0.22,
    glow: 2.2,
    streak: 0,
  },
};

const toRgb = (hex: string): TRgb => {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const randomIn = ([min, max]: TRange) => min + Math.random() * (max - min);
const randomSigned = () => Math.random() * 2 - 1;
const bellCurve = () => (Math.random() + Math.random() + Math.random()) / 1.5 - 1;
const rgba = ([red, green, blue]: TRgb, alpha: number) => `rgba(${red}, ${green}, ${blue}, ${alpha})`;

const twinkle = (time: number, rate: number, phase: number) =>
  0.5 + 0.5 * Math.sin(time * rate + phase) * Math.sin(time * rate * FLICKER_HARMONIC + phase);

const heatOf = (spark: ISpark) => spark.initialHeat * (1 - (spark.age / spark.life) ** COOLING);

const heatToRgb = (ramp: TRgb[], heat: number): TRgb => {
  const position = clamp01(heat) * (ramp.length - 1);
  const index = Math.min(Math.floor(position), ramp.length - 2);
  const mix = position - index;
  const [fromRed, fromGreen, fromBlue] = ramp[index];
  const [toRed, toGreen, toBlue] = ramp[index + 1];
  return [
    Math.round(fromRed + (toRed - fromRed) * mix),
    Math.round(fromGreen + (toGreen - fromGreen) * mix),
    Math.round(fromBlue + (toBlue - fromBlue) * mix),
  ];
};

const pickKind = (): TSparkKind => {
  const roll = Math.random();
  if (roll < SPARK_SHARE) return "spark";
  if (roll < 1 - MOTE_SHARE) return "ember";
  return "mote";
};

const createGlowSprite = (color: TRgb, core: TRgb, stops: TGlowStop[]) => {
  const sprite = document.createElement("canvas");
  sprite.width = SPRITE_SIZE;
  sprite.height = SPRITE_SIZE;
  const context = sprite.getContext("2d");
  if (!context) return sprite;
  const center = SPRITE_SIZE / 2;
  const gradient = context.createRadialGradient(center, center, 0, center, center, center);
  stops.forEach(([offset, alpha, tone]) => gradient.addColorStop(offset, rgba(tone === "core" ? core : color, alpha)));
  context.fillStyle = gradient;
  context.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  return sprite;
};

const createGlowSprites = (ramp: TRgb[], stops: TGlowStop[], coreBoost: number) =>
  Array.from({ length: SPRITE_STEPS }, (_, step) => {
    const heat = step / (SPRITE_STEPS - 1);
    return createGlowSprite(heatToRgb(ramp, heat), heatToRgb(ramp, heat + coreBoost), stops);
  });

export function createForgeSparksRenderer(
  canvas: HTMLCanvasElement,
  palette: IForgeSparksPalette,
): IForgeSparksRenderer | null {
  const context = canvas.getContext("2d");
  if (!context) return null;

  const ramp = palette.ramp.map(toRgb);
  const hearthCore = ramp[1];
  const hearthEdge = ramp[0];
  const sharpSprites = createGlowSprites(ramp, SHARP_GLOW, CORE_HEAT_BOOST);
  const softSprites = createGlowSprites(ramp, SOFT_GLOW, 0);
  const hottestSprite = sharpSprites[SPRITE_STEPS - 1];
  const sparks: ISpark[] = [];
  const flares: IFlare[] = [];
  const air = { x: 0, y: 0 };
  let width = 0;
  let height = 0;
  let ratio = 1;
  let time = 0;
  let pendingEmission = 0;
  let nextBurst = randomIn(BURST_INTERVAL);
  let isWarm = false;

  const hearthHalfWidth = () => Math.min(width, HEARTH_MAX_WIDTH) / 2;
  const hearthX = () => width / 2 + bellCurve() * hearthHalfWidth() * HEARTH_SPREAD;

  const sampleAir = (x: number, y: number) => {
    air.x = 0;
    air.y = -RISE_SPEED * (0.55 + 0.45 * (y / height));
    EDDIES.forEach(({ frequency, drift, strength, phase }) => {
      const across = x * frequency + time * drift + phase;
      const along = y * frequency + time * drift * 1.6 + phase;
      air.x += strength * Math.sin(across) * Math.cos(along);
      air.y -= strength * Math.cos(across) * Math.sin(along);
    });
  };

  const launch = (kind: TSparkKind, x: number, angle: number, speed: number, heat: number) => {
    if (sparks.length >= MAX_SPARKS) return;
    const preset = PRESETS[kind];
    sparks.push({
      kind,
      x,
      y: height - Math.random() * 4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      age: 0,
      life: randomIn(preset.life),
      size: randomIn(preset.size),
      initialHeat: heat,
      drag: randomIn(preset.drag),
      flickerRate: randomIn(FLICKER_RATE),
      flickerPhase: Math.random() * Math.PI * 2,
    });
  };

  const emit = () => {
    const kind = pickKind();
    const preset = PRESETS[kind];
    launch(kind, hearthX(), UPWARD + randomSigned() * preset.spread, randomIn(preset.speed), randomIn(preset.heat));
  };

  const burst = () => {
    const x = hearthX();
    const count = Math.round(randomIn(BURST_COUNT));
    for (let index = 0; index < count; index += 1) {
      launch(
        "spark",
        x + randomSigned() * BURST_SCATTER,
        UPWARD + randomSigned() * BURST_SPREAD,
        randomIn(BURST_SPEED),
        1,
      );
    }
    flares.push({ x, age: 0 });
  };

  const step = (delta: number) => {
    time += delta;
    pendingEmission += hearthHalfWidth() * 2 * EMISSION_PER_PIXEL * delta;
    while (pendingEmission >= 1) {
      emit();
      pendingEmission -= 1;
    }

    nextBurst -= delta;
    if (nextBurst <= 0) {
      burst();
      nextBurst = randomIn(BURST_INTERVAL);
    }

    for (let index = sparks.length - 1; index >= 0; index -= 1) {
      const spark = sparks[index];
      spark.age += delta;
      if (spark.age >= spark.life || spark.y < 0) {
        sparks[index] = sparks[sparks.length - 1];
        sparks.pop();
        continue;
      }
      const preset = PRESETS[spark.kind];
      sampleAir(spark.x, spark.y);
      spark.vx += (air.x - spark.vx) * spark.drag * delta;
      spark.vy += ((air.y - spark.vy) * spark.drag + preset.gravity - preset.lift * heatOf(spark)) * delta;
      spark.x += spark.vx * delta;
      spark.y += spark.vy * delta;
    }

    for (let index = flares.length - 1; index >= 0; index -= 1) {
      flares[index].age += delta;
      if (flares[index].age >= FLARE_SECONDS) flares.splice(index, 1);
    }
  };

  const drawHearth = () => {
    const flareBoost = flares.reduce((total, flare) => total + 1 - flare.age / FLARE_SECONDS, 0);
    const intensity =
      HEARTH_GLOW_BASE +
      HEARTH_GLOW_FLICKER * twinkle(time, HEARTH_FLICKER_RATE, 0) +
      HEARTH_GLOW_FLARE * flareBoost;
    const gradient = context.createRadialGradient(0, 0, 0, 0, 0, HEARTH_GLOW_HEIGHT);
    gradient.addColorStop(0, rgba(hearthCore, clamp01(intensity)));
    gradient.addColorStop(0.3, rgba(hearthEdge, clamp01(intensity * 0.6)));
    gradient.addColorStop(1, rgba(hearthEdge, 0));
    context.setTransform((ratio * hearthHalfWidth()) / HEARTH_GLOW_HEIGHT, 0, 0, ratio, (ratio * width) / 2, ratio * height);
    context.globalAlpha = 1;
    context.fillStyle = gradient;
    context.fillRect(-HEARTH_GLOW_HEIGHT, -HEARTH_GLOW_HEIGHT, HEARTH_GLOW_HEIGHT * 2, HEARTH_GLOW_HEIGHT);
  };

  const drawFlare = (flare: IFlare) => {
    const fade = 1 - flare.age / FLARE_SECONDS;
    const radius = FLARE_RADIUS * (0.6 + 0.4 * fade);
    context.setTransform(ratio, 0, 0, ratio, ratio * flare.x, ratio * height);
    context.globalAlpha = fade * fade * FLARE_OPACITY;
    context.drawImage(hottestSprite, -radius, -radius, radius * 2, radius * 2);
  };

  const drawSpark = (spark: ISpark) => {
    const preset = PRESETS[spark.kind];
    const heat = heatOf(spark);
    const alpha =
      preset.opacity *
      clamp01(spark.age / FADE_IN_SECONDS) *
      clamp01(spark.y / TOP_FADE_DISTANCE) *
      clamp01(heat * 1.6) *
      (1 - preset.flicker * twinkle(spark.age, spark.flickerRate, spark.flickerPhase));
    if (alpha <= 0.01) return;

    const radius = spark.size * preset.glow * (0.6 + 0.4 * heat);
    const speed = Math.hypot(spark.vx, spark.vy) || 1;
    const stretch = 1 + (speed * preset.streak) / radius;
    const cos = spark.vx / speed;
    const sin = spark.vy / speed;
    const trail = preset.streak / 2;
    const sprites = spark.kind === "mote" ? softSprites : sharpSprites;
    context.setTransform(
      cos * stretch * ratio,
      sin * stretch * ratio,
      -sin * ratio,
      cos * ratio,
      (spark.x - spark.vx * trail) * ratio,
      (spark.y - spark.vy * trail) * ratio,
    );
    context.globalAlpha = alpha;
    context.drawImage(sprites[Math.round(heat * (SPRITE_STEPS - 1))], -radius, -radius, radius * 2, radius * 2);
  };

  const draw = () => {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = palette.blend;
    drawHearth();
    flares.forEach(drawFlare);
    sparks.forEach(drawSpark);
    context.globalAlpha = 1;
    context.globalCompositeOperation = "source-over";
  };

  return {
    resize: (nextWidth, nextHeight, pixelRatio) => {
      width = nextWidth;
      height = nextHeight;
      ratio = pixelRatio;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      if (isWarm || !width || !height) return;
      isWarm = true;
      for (let index = 0; index < WARM_UP_STEPS; index += 1) step(WARM_UP_DELTA);
    },
    render: (delta) => {
      if (!width || !height) return;
      step(delta);
      draw();
    },
  };
}

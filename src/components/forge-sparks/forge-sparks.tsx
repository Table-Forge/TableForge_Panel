import { useEffect, useRef } from "react";
import { useBoundStore } from "@/src/store";
import { createForgeSparksRenderer } from "./forge-sparks.renderer";
import type { IForgeSparks, IForgeSparksPalette } from "./forge-sparks.interfaces";

const MAX_PIXEL_RATIO = 2;
const MAX_FRAME_SECONDS = 1 / 30;

const readThemeValue = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const resolvePalette = (): IForgeSparksPalette => ({
  ramp: readThemeValue("--tf-spark-ramp")
    .split(",")
    .map((color) => color.trim()),
  blend: readThemeValue("--tf-spark-blend") as GlobalCompositeOperation,
});

export function ForgeSparks({ className = "" }: IForgeSparks) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useBoundStore((state) => state.theme);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const renderer = createForgeSparksRenderer(canvas, resolvePalette());
    if (!renderer) return;

    let frame = 0;
    let previousTime = 0;

    const tick = (now: number) => {
      const delta = previousTime ? Math.min((now - previousTime) / 1000, MAX_FRAME_SECONDS) : 0;
      previousTime = now;
      renderer.render(delta);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame) return;
      previousTime = 0;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const resizeObserver = new ResizeObserver(() => {
      renderer.resize(
        canvas.clientWidth,
        canvas.clientHeight,
        Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO),
      );
    });
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        start();
      } else {
        stop();
      }
    });
    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [theme]);

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
    </div>
  );
}

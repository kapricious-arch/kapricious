import { useCallback, useEffect, useRef, useState } from "react";

interface ScrollRobotProps {
  className?: string;
}

const FRAME_COUNT = 80;
const FRAME_INDICES = Array.from({ length: FRAME_COUNT }, (_, i) => i);
const MOBILE_BREAKPOINT = 768;
const MOBILE_SCROLL_SPEED_MULTIPLIER = 1.35;
const MOBILE_FRAME_STEP = 3;
const DESKTOP_DPR_CAP = 2;
const MOBILE_DPR_CAP = 1.25;

const currentFrame = (index: number) =>
  `/robo/Robot_face_transition_delpmaspu__${index.toString().padStart(3, "0")}.jpg`;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const getIsConstrainedDevice = () => {
  if (typeof window === "undefined") return false;

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };

  return (
    window.innerWidth < MOBILE_BREAKPOINT ||
    nav.connection?.saveData === true ||
    (nav.deviceMemory ?? Infinity) <= 4 ||
    (navigator.hardwareConcurrency ?? Infinity) <= 4
  );
};

const ScrollRobot = ({ className = "" }: ScrollRobotProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const activeFrameIndicesRef = useRef<number[]>(FRAME_INDICES);
  const trackRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number>(0);
  const isActiveRef = useRef<boolean>(true);
  const trackStartRef = useRef<number>(0);
  const totalDistanceRef = useRef<number>(1);
  const lastProgressRef = useRef<number>(-1);
  const canvasSizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const [imagesReady, setImagesReady] = useState(false);
  const loadedCountRef = useRef(0);
  const initialDrawDoneRef = useRef(false);

  const updateTrackMetrics = useCallback(() => {
    const track = document.querySelector(".hero-scroll-track") as HTMLElement | null;
    if (!track) return;

    trackRef.current = track;
    const rect = track.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const stickyDistance = Math.max(0, track.offsetHeight - window.innerHeight);
    const postStickyDistance = window.innerHeight;

    trackStartRef.current = scrollY + rect.top;
    totalDistanceRef.current = Math.max(1, stickyDistance + postStickyDistance);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dprCap = getIsConstrainedDevice() ? MOBILE_DPR_CAP : DESKTOP_DPR_CAP;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    if (
      width === canvasSizeRef.current.width &&
      height === canvasSizeRef.current.height &&
      dpr === canvasSizeRef.current.dpr
    ) {
      return;
    }

    canvas.width = width;
    canvas.height = height;
    canvasSizeRef.current = { width, height, dpr };

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = getIsConstrainedDevice() ? "medium" : "high";
      ctxRef.current = ctx;
    }
  }, []);

  const drawImageCover = useCallback((ctx: CanvasRenderingContext2D, img: HTMLImageElement, alpha = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imageAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let dx = 0;
    let dy = 0;

    if (canvasAspect > imageAspect) {
      drawHeight = canvasWidth / imageAspect;
      dy = (canvasHeight - drawHeight) * 0.5;
    } else {
      drawWidth = canvasHeight * imageAspect;
      dx = (canvasWidth - drawWidth) * 0.5;
    }

    if (alpha < 1) {
      ctx.globalAlpha = alpha;
    }

    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

    if (alpha < 1) {
      ctx.globalAlpha = 1;
    }
  }, []);

  const drawFrame = useCallback(
    (progress: number) => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      const isConstrainedDevice = getIsConstrainedDevice();
      const activeFrameIndices = activeFrameIndicesRef.current;
      const activeFrameCount = activeFrameIndices.length;

      if (activeFrameCount === 0) return;

      let baseIndex = 0;
      let nextIndex = 0;
      let mix = 0;

      if (isConstrainedDevice) {
        const activeIndex = Math.round(progress * (activeFrameCount - 1));
        baseIndex = activeFrameIndices[activeIndex] ?? 0;
        nextIndex = baseIndex;
      } else {
        const frameFloat = progress * (FRAME_COUNT - 1);
        baseIndex = Math.floor(frameFloat);
        nextIndex = Math.min(FRAME_COUNT - 1, baseIndex + 1);
        mix = frameFloat - baseIndex;
      }

      const baseImage = imagesRef.current[baseIndex];
      if (!baseImage || !baseImage.complete || baseImage.naturalWidth === 0) return;

      drawImageCover(ctx, baseImage, 1);

      if (mix > 0.001) {
        const nextImage = imagesRef.current[nextIndex];
        if (nextImage && nextImage.complete && nextImage.naturalWidth > 0) {
          drawImageCover(ctx, nextImage, mix);
        }
      }
    },
    [drawImageCover],
  );

  const computeProgress = useCallback(() => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const relativeY = scrollY - trackStartRef.current;
    const speed = getIsConstrainedDevice() ? MOBILE_SCROLL_SPEED_MULTIPLIER : 1;
    return clamp((relativeY / totalDistanceRef.current) * speed, 0, 1);
  }, []);

  const renderIfNeeded = useCallback(() => {
    rafRef.current = 0;

    if (!isActiveRef.current) return;

    const progress = computeProgress();
    if (Math.abs(progress - lastProgressRef.current) < 0.01) return;

    drawFrame(progress);
    lastProgressRef.current = progress;
  }, [computeProgress, drawFrame]);

  const scheduleRender = useCallback(() => {
    if (rafRef.current !== 0) return;
    rafRef.current = window.requestAnimationFrame(renderIfNeeded);
  }, [renderIfNeeded]);

  useEffect(() => {
    const images: HTMLImageElement[] = [];
    const isConstrainedDevice = getIsConstrainedDevice();
    const activeFrameIndices = isConstrainedDevice
      ? FRAME_INDICES.filter((frameIdx) => frameIdx % MOBILE_FRAME_STEP === 0 || frameIdx === FRAME_COUNT - 1)
      : FRAME_INDICES;

    activeFrameIndicesRef.current = activeFrameIndices;
    loadedCountRef.current = 0;
    initialDrawDoneRef.current = false;
    setImagesReady(false);

    activeFrameIndices.forEach((frameIdx, i) => {
      const img = new Image();
      img.decoding = "async";
      if ("fetchPriority" in img) {
        (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = i < 8 ? "high" : "auto";
      }
      img.onload = () => {
        loadedCountRef.current += 1;
        if (frameIdx === activeFrameIndices[0] && !initialDrawDoneRef.current) {
          initialDrawDoneRef.current = true;
          resizeCanvas();
          updateTrackMetrics();
          const ctx = ctxRef.current;
          if (ctx && img.naturalWidth > 0) {
            drawImageCover(ctx, img, 1);
          }
          setImagesReady(true);
        }
        if (loadedCountRef.current >= Math.min(8, activeFrameIndices.length)) {
          scheduleRender();
        }
      };
      img.src = currentFrame(frameIdx);
      images[frameIdx] = img;
    });

    imagesRef.current = images;
    updateTrackMetrics();
    resizeCanvas();

    return () => {
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [drawImageCover, resizeCanvas, scheduleRender, updateTrackMetrics]);

  useEffect(() => {
    const handleResize = () => {
      updateTrackMetrics();
      resizeCanvas();
      lastProgressRef.current = -1;
      scheduleRender();
    };

    const handleScroll = () => {
      if (!isActiveRef.current || !imagesReady) return;
      scheduleRender();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isActiveRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          lastProgressRef.current = -1;
          scheduleRender();
        }
      },
      { root: null, rootMargin: "100% 0px 100% 0px", threshold: 0 },
    );

    if (trackRef.current) {
      observer.observe(trackRef.current);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("lenis:scroll", handleScroll);
    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("visibilitychange", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("lenis:scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleResize);
    };
  }, [imagesReady, resizeCanvas, scheduleRender, updateTrackMetrics]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "none",
        maxHeight: "none",
        objectFit: "cover",
        display: "block",
        borderRadius: "0px",
        contain: "strict",
        willChange: "transform",
      }}
    />
  );
};

export default ScrollRobot;

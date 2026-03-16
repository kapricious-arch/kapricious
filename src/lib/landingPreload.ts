const LANDING_CACHE_VERSION = "kapricious-landing-v1";
const LANDING_CACHE_STORAGE_KEY = "kapricious:landing-cache";
const LANDING_CACHE_NAME = "kapricious-landing-assets";

const FRAME_COUNT = 80;
const framePath = (index: number) =>
  `/robo/Robot_face_transition_delpmaspu__${index.toString().padStart(3, "0")}.jpg`;

const CRITICAL_ASSETS = [
  ...Array.from({ length: 16 }, (_, index) => ({
    url: framePath(index),
    type: "image" as const,
  })),
  { url: "/logo.png", type: "image" as const },
];

const BACKGROUND_ASSETS = [
  ...Array.from({ length: FRAME_COUNT }, (_, index) => framePath(index)),
  "/logo.png",
];

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const preloadImage = (url: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });

const preloadAsset = (url: string) => preloadImage(url);

const warmAssetCache = async (url: string) => {
  try {
    if ("caches" in window) {
      const cache = await caches.open(LANDING_CACHE_NAME);
      const cached = await cache.match(url);
      if (cached) return;

      const response = await fetch(url, { cache: "force-cache" });
      if (response.ok) {
        await cache.put(url, response.clone());
      }
      return;
    }

    await fetch(url, { cache: "force-cache" });
  } catch {
    // Browser cache warming is a best-effort enhancement.
  }
};

export const hasWarmLandingCache = () => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(LANDING_CACHE_STORAGE_KEY) === LANDING_CACHE_VERSION;
};

export const preloadLandingExperience = async (
  onProgress?: (progress: number) => void,
) => {
  const cached = hasWarmLandingCache();
  const startedAt = performance.now();
  let loaded = 0;

  onProgress?.(0);

  await Promise.allSettled(
    CRITICAL_ASSETS.map(async (asset) => {
      await preloadAsset(asset.url);
      loaded += 1;
      onProgress?.(loaded / CRITICAL_ASSETS.length);
    }),
  );

  window.localStorage.setItem(LANDING_CACHE_STORAGE_KEY, LANDING_CACHE_VERSION);

  void Promise.allSettled(BACKGROUND_ASSETS.map((url) => warmAssetCache(url)));

  const minVisibleTime = cached ? 350 : 1350;
  const elapsed = performance.now() - startedAt;
  if (elapsed < minVisibleTime) {
    await delay(minVisibleTime - elapsed);
  }

  return { cached };
};

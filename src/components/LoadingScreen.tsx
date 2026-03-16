import { AnimatePresence, motion } from "framer-motion";

interface LoadingScreenProps {
  progress?: number;
  cached?: boolean;
  label?: string;
}

const loaderWords = ["KMEA", "TECH FEST", "KAPRICIOUS'26"];

const LoadingScreen = ({
  progress = 0,
  cached = false,
  label = "Building the landing experience",
}: LoadingScreenProps) => {
  const safeProgress = Math.max(0.06, Math.min(progress, 1));
  const activeWord = loaderWords[Math.min(loaderWords.length - 1, Math.floor(safeProgress * loaderWords.length))];

  return (
    <div className="landing-loader fixed inset-0 z-[120] flex items-center justify-center px-6 py-10">
      <div className="landing-loader__backdrop" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="landing-loader__card relative w-full max-w-xl overflow-hidden rounded-[40px] border border-white/10 px-6 py-8 text-white shadow-[0_30px_90px_rgba(0,0,0,0.35)] md:px-10 md:py-10"
      >
        <div className="landing-loader__grid" />
        <div className="relative z-10 flex flex-col gap-7">
          <div className="flex items-center justify-between gap-4">
            <div className="landing-loader__brandmark" aria-hidden="true">
              <motion.span
                className="landing-loader__bar landing-loader__bar--stem"
                animate={{ scaleY: [0.95, 1, 0.95] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                className="landing-loader__bar landing-loader__bar--top"
                animate={{ rotate: [41, 46, 41] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                className="landing-loader__bar landing-loader__bar--bottom"
                animate={{ rotate: [-41, -46, -41] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.12 }}
              />
            </div>

            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.45em] text-white/60">
                {cached ? "cached launch" : "warming cache"}
              </p>
              <p className="mt-2 text-sm font-medium text-white/90">{label}</p>
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.5em] text-[#7cf2d3]">KMEA Engineering College</p>
            <AnimatePresence mode="wait">
              <motion.h2
                key={activeWord}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 text-4xl font-bold tracking-tight text-white md:text-6xl"
              >
                {activeWord}
              </motion.h2>
            </AnimatePresence>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/68 md:text-base">
              A smooth entry into the KMEA tech fest experience with preloaded hero media and cleaner scroll playback.
            </p>
          </div>

          <div className="space-y-3">
            <div className="landing-loader__progress-track">
              <motion.div
                className="landing-loader__progress-fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: safeProgress }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-white/55">
              <span>Kapricious</span>
              <span>{Math.round(safeProgress * 100)}%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;

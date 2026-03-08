import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import robotImage from "@/assets/unnamed-removebg-preview.png";

interface InteractiveRobotProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const InteractiveRobot = ({ containerRef }: InteractiveRobotProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<DOMRect | null>(null);
  const robotRef = useRef<HTMLDivElement>(null);

  // Eye tracking motion values
  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);
  const smoothEyeX = useSpring(eyeX, { stiffness: 150, damping: 20 });
  const smoothEyeY = useSpring(eyeY, { stiffness: 150, damping: 20 });

  // Arm tracking
  const armRotate = useMotionValue(0);
  const armX = useMotionValue(0);
  const armY = useMotionValue(0);
  const smoothArmRotate = useSpring(armRotate, { stiffness: 60, damping: 18 });
  const smoothArmX = useSpring(armX, { stiffness: 50, damping: 16 });
  const smoothArmY = useSpring(armY, { stiffness: 50, damping: 16 });

  // Hand glow
  const glowOpacity = useMotionValue(0);
  const smoothGlow = useSpring(glowOpacity, { stiffness: 100, damping: 15 });

  // Trail positions
  const trailX = useMotionValue(0);
  const trailY = useMotionValue(0);
  const smoothTrailX = useSpring(trailX, { stiffness: 30, damping: 12 });
  const smoothTrailY = useSpring(trailY, { stiffness: 30, damping: 12 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Detect hovers on interactive elements
  useEffect(() => {
    if (isMobile) return;

    const selectors = [
      "[data-robot-interact]",
      'a[href="/register"]',
      'a[href="/events"]',
      ".robot-interactive",
    ];

    const handleMouseEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      setHoveredElement(rect);
      el.classList.add("robot-element-glow");
      glowOpacity.set(1);
    };

    const handleMouseLeave = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      setHoveredElement(null);
      el.classList.remove("robot-element-glow");
      glowOpacity.set(0);
    };

    const elements: HTMLElement[] = [];
    const observer = new MutationObserver(() => {
      // Re-bind on DOM changes
      bindElements();
    });

    const bindElements = () => {
      // Cleanup old
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      elements.length = 0;

      selectors.forEach((sel) => {
        document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
          el.addEventListener("mouseenter", handleMouseEnter);
          el.addEventListener("mouseleave", handleMouseLeave);
          elements.push(el);
        });
      });
    };

    bindElements();
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [isMobile, glowOpacity]);

  // Mouse tracking
  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (isMobile || !robotRef.current) return;

      const robotRect = robotRef.current.getBoundingClientRect();
      const robotCenterX = robotRect.left + robotRect.width * 0.5;
      const robotCenterY = robotRect.top + robotRect.height * 0.28; // Eye area

      const dx = e.clientX - robotCenterX;
      const dy = e.clientY - robotCenterY;

      // Eye movement (clamped to small range)
      const maxEyeMove = 6;
      const dist = Math.hypot(dx, dy);
      const normalizedX = dist > 0 ? (dx / dist) * Math.min(dist * 0.02, maxEyeMove) : 0;
      const normalizedY = dist > 0 ? (dy / dist) * Math.min(dist * 0.015, maxEyeMove * 0.7) : 0;
      eyeX.set(normalizedX);
      eyeY.set(normalizedY);

      // Arm rotation toward cursor
      const armCenterY = robotRect.top + robotRect.height * 0.55;
      const armDx = e.clientX - robotCenterX;
      const armDy = e.clientY - armCenterY;
      const angle = Math.atan2(armDy, armDx) * (180 / Math.PI);
      const clampedAngle = Math.max(-35, Math.min(35, angle * 0.3));
      armRotate.set(clampedAngle);

      // Arm translation (subtle)
      armX.set(Math.max(-15, Math.min(15, armDx * 0.02)));
      armY.set(Math.max(-10, Math.min(10, armDy * 0.015)));

      // Trail
      trailX.set(armDx * 0.04);
      trailY.set(armDy * 0.03);
    },
    [isMobile, eyeX, eyeY, armRotate, armX, armY, trailX, trailY]
  );

  const handleMouseLeave = useCallback(() => {
    eyeX.set(0);
    eyeY.set(0);
    armRotate.set(0);
    armX.set(0);
    armY.set(0);
    trailX.set(0);
    trailY.set(0);
    glowOpacity.set(0);
  }, [eyeX, eyeY, armRotate, armX, armY, trailX, trailY, glowOpacity]);

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile, handleMouseMove, handleMouseLeave]);

  return (
    <div ref={robotRef} className="relative w-full h-full">
      {/* Robot Base Image */}
      <img
        src={robotImage}
        alt="Kapricious AI Robot Assistant"
        className="w-full h-full object-contain object-bottom opacity-80 md:opacity-100"
      />

      {/* Eye Tracking Overlay (positioned over the robot's eye area) */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Left Eye */}
          <motion.div
            className="absolute"
            style={{
              top: "24%",
              left: "38%",
              width: "8%",
              height: "5%",
              x: smoothEyeX,
              y: smoothEyeY,
            }}
          >
            <div className="w-full h-full rounded-full bg-accent/80 blur-[2px] shadow-[0_0_12px_hsl(168,80%,45%,0.8)]" />
          </motion.div>

          {/* Right Eye */}
          <motion.div
            className="absolute"
            style={{
              top: "24%",
              left: "55%",
              width: "8%",
              height: "5%",
              x: smoothEyeX,
              y: smoothEyeY,
            }}
          >
            <div className="w-full h-full rounded-full bg-accent/80 blur-[2px] shadow-[0_0_12px_hsl(168,80%,45%,0.8)]" />
          </motion.div>

          {/* Eye scan line effect */}
          <motion.div
            className="absolute"
            style={{
              top: "22%",
              left: "35%",
              width: "32%",
              height: "10%",
            }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full border border-accent/20 rounded-lg" />
          </motion.div>
        </div>
      )}

      {/* Arm Extension Overlay */}
      {!isMobile && (
        <motion.div
          className="absolute pointer-events-none origin-[30%_20%]"
          style={{
            top: "40%",
            right: "5%",
            width: "35%",
            height: "30%",
            rotate: smoothArmRotate,
            x: smoothArmX,
            y: smoothArmY,
          }}
        >
          {/* Arm glow trail */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2"
            style={{
              width: "60%",
              height: "4px",
              x: smoothTrailX,
              y: smoothTrailY,
              opacity: smoothGlow,
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-accent/40 to-accent/80 rounded-full blur-[3px]" />
          </motion.div>

          {/* Hand glow */}
          <motion.div
            className="absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6"
            style={{ opacity: smoothGlow }}
          >
            <div className="w-full h-full rounded-full bg-accent/60 blur-md shadow-[0_0_20px_hsl(168,80%,45%,0.6)]" />
          </motion.div>
        </motion.div>
      )}

      {/* Ambient body glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0, 0.08, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-1/2 rounded-full bg-accent/20 blur-3xl" />
      </motion.div>

      {/* Chest core glow */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: "38%",
          left: "43%",
          width: "14%",
          height: "8%",
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full rounded-full bg-accent/40 blur-md shadow-[0_0_25px_hsl(168,80%,45%,0.5)]" />
      </motion.div>
    </div>
  );
};

export default InteractiveRobot;

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { useMotionPreference } from "../../lib/motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const { reduced } = useMotionPreference();
  const spring = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-glow/20 via-glow/70 to-glow/20"
      style={{ scaleX: reduced || !ready ? scrollYProgress : spring }}
    />
  );
}

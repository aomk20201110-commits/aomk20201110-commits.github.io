import { cn } from "../../lib/cn";

/**
 * A deterministic, self-contained field plate. It is the static counterpart
 * to the live shader and also the mobile/low-power fallback: no network,
 * no canvas, no animation. The composition is original.
 */
export function FieldPlate({
  className,
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "compact";
}) {
  const compact = variant === "compact";
  const contours = Array.from({ length: 15 }, (_, row) => {
    const base = 250 + row * 27;
    const points: string[] = [];
    for (let x = -20; x <= 1220; x += 20) {
      const d1 = Math.hypot(x - 250, base - 190);
      const d2 = Math.hypot(x - 760, base - 330);
      const interference = Math.sin(d1 * 0.035) * 22 + Math.sin(d2 * 0.03 + 1.4) * 16;
      const fade = 1 - Math.abs(x - 590) / 900;
      const y = base + interference * Math.max(0.25, fade);
      points.push(`${points.length === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(" ");
  });

  return (
    <div className={cn("relative overflow-hidden", className)} aria-hidden="true">
      <svg
        viewBox={compact ? "700 360 500 400" : "0 0 1200 760"}
        className="h-full w-full"
        preserveAspectRatio={compact ? "xMidYMax meet" : "xMidYMax slice"}
      >
        <defs>
          <linearGradient id="plate-fog" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--c-void)" stopOpacity="0" />
            <stop offset="72%" stopColor="var(--c-void)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--c-void)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="plate-structure" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--c-scene-fill)" stopOpacity="0.96" />
            <stop offset="100%" stopColor="var(--c-scene-void)" stopOpacity="0.98" />
          </linearGradient>
          <linearGradient id="plate-figure" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--c-scene-figure)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--c-scene-figure-2)" stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id="plate-halo" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="var(--c-glow)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--c-glow)" stopOpacity="0" />
          </radialGradient>
          <pattern id="plate-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0H0V60" fill="none" stroke="var(--c-chart-grid)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="1200" height="760" fill="transparent" />
        <rect x="430" y="40" width="760" height="520" fill="url(#plate-halo)" />
        <rect x="0" y="0" width="1200" height="760" fill="url(#plate-grid)" opacity="0.55" />

        {contours.map((d, index) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="var(--c-chart-line)"
            strokeWidth={index % 3 === 0 ? 1.1 : 0.65}
            opacity={0.11 + (index % 5) * 0.035}
          />
        ))}

        {/* The colossus: a concrete core with broken fins and dead antennas. */}
        <g fill="url(#plate-structure)" stroke="var(--c-scene-edge)" strokeWidth="1.2">
          <path d="M604 690 L604 210 L672 210 L672 150 L706 150 L706 96 L744 96 L744 690 Z" />
          <path d="M744 690 L744 54 L796 54 L796 120 L836 120 L836 690 Z" />
          <path d="M836 690 L836 176 L884 176 L884 104 L924 104 L924 690 Z" />
          <path d="M924 690 L924 218 L980 218 L980 138 L1030 138 L1030 690 Z" />
          <path d="M1030 690 L1030 246 L1098 246 L1098 690 Z" />
          <path d="M1098 690 L1098 300 L1180 300 L1180 690 Z" />
          <path d="M560 690 L560 384 L604 384 L604 690 Z" />
        </g>

        {/* vertical fins / voids */}
        <g stroke="var(--c-scene-void)" strokeWidth="3" opacity="0.85">
          {Array.from({ length: 26 }, (_, i) => {
            const x = 614 + i * 22;
            return <line key={i} x1={x} y1={226 + (i % 4) * 36} x2={x} y2={690} />;
          })}
        </g>
        <g fill="var(--c-scene-void)" opacity="0.7">
          <rect x="676" y="250" width="16" height="10" />
          <rect x="760" y="190" width="22" height="8" />
          <rect x="852" y="320" width="18" height="8" />
          <rect x="948" y="264" width="24" height="8" />
          <rect x="1006" y="392" width="16" height="8" />
          <rect x="1090" y="336" width="20" height="8" />
        </g>

        {/* antenna masts and cables */}
        <g stroke="var(--c-steel)" strokeWidth="1" opacity="0.5" fill="none">
          <path d="M744 96 L744 20 L760 44 L776 18" />
          <path d="M924 104 L924 36 L948 66" />
          <path d="M1030 138 L1030 74" />
          <path d="M560 384 C520 340, 470 360, 436 320" strokeDasharray="3 7" />
          <path d="M604 300 C560 250, 520 268, 488 226" strokeDasharray="2 8" />
        </g>

        {/* ground / broken parapet */}
        <path d="M0 690 L1200 690 L1200 760 L0 760 Z" fill="var(--c-scene-void)" opacity="0.96" />
        <path
          d="M0 686 L168 686 L196 676 L248 676 L274 688 L404 688 L430 678 L520 678 L548 690 L660 690 L690 680 L770 680 L800 692 L900 692 L930 684 L1010 684 L1040 694 L1200 694"
          fill="none"
          stroke="var(--c-line)"
          strokeWidth="1.4"
        />
        <g fill="var(--c-scene-void)" stroke="var(--c-scene-edge)" strokeWidth="1.2">
          <rect x="96" y="636" width="58" height="42" />
          <rect x="118" y="606" width="18" height="30" />
          <rect x="256" y="642" width="80" height="34" />
          <rect x="300" y="620" width="10" height="22" />
          <rect x="414" y="650" width="42" height="24" />
        </g>

        {/* Two small travellers, seen from behind. Original silhouettes. */}
        <g transform="translate(-58 -34)">
          <g className="plate-figures" fill="url(#plate-figure)" stroke="var(--c-scene-edge)" strokeWidth="1.1">
          <ellipse cx="862" cy="666" rx="118" ry="16" fill="var(--c-scene-void)" opacity="0.55" stroke="none" />
          {/* taller: round helmet, long dark coat, bobbed hair */}
          <ellipse cx="842" cy="574" rx="35" ry="37" />
          <path d="M808 590 Q808 548 842 544 Q876 548 876 590 L870 650 L814 650 Z" />
          <path d="M810 558 Q806 580 816 596 L828 588 Q818 574 820 554 Z" fill="var(--c-scene-void)" stroke="none" opacity="0.85" />
          <rect x="812" y="566" width="24" height="54" rx="7" fill="var(--c-scene-fill)" opacity="0.9" />
          <path d="M812 576 L836 576 M812 590 L836 590" stroke="var(--c-scene-void)" strokeWidth="1.6" opacity="0.55" fill="none" />
          <path d="M818 538 Q842 526 866 538" fill="none" stroke="var(--c-void)" strokeWidth="4" opacity="0.5" />
          <path d="M806 590 Q780 610 770 646" fill="none" stroke="var(--c-mist)" strokeWidth="10" strokeLinecap="round" />
          <path d="M844 604 L840 652" stroke="var(--c-void)" strokeWidth="2" opacity="0.45" />
          <path d="M808 590 Q808 548 842 544 Q876 548 876 590" fill="none" stroke="var(--c-glow)" strokeWidth="1.4" opacity="0.55" />
          <path d="M812 612 Q842 624 872 612" fill="none" stroke="var(--c-void)" strokeWidth="2" opacity="0.35" />
          <path d="M818 650 L816 666 M864 650 L866 666" stroke="var(--c-scene-void)" strokeWidth="9" strokeLinecap="round" />
          {/* smaller: cross-patched cap, pale scarf */}
          <ellipse cx="922" cy="592" rx="29" ry="31" />
          <path d="M896 604 Q896 568 922 564 Q948 568 948 604 L942 654 L902 654 Z" />
          <path d="M902 558 Q922 548 942 558" fill="none" stroke="var(--c-void)" strokeWidth="4" opacity="0.5" />
          <path d="M915 568 v13 M908.5 574.5 h13" stroke="var(--c-amber)" strokeWidth="3.2" strokeLinecap="round" opacity="0.95" fill="none" />
          <path d="M944 606 Q966 620 976 648" fill="none" stroke="var(--c-ice)" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
          <path d="M896 620 Q870 634 862 652" fill="none" stroke="var(--c-mist)" strokeWidth="8" strokeLinecap="round" />
          <path d="M898 624 Q922 636 946 622" fill="none" stroke="var(--c-amber)" strokeWidth="1.6" opacity="0.55" />
          <path d="M896 604 Q896 568 922 564 Q948 568 948 604" fill="none" stroke="var(--c-glow)" strokeWidth="1.3" opacity="0.5" />
          <path d="M902 608 Q922 620 942 608" fill="none" stroke="var(--c-void)" strokeWidth="2" opacity="0.3" />
          <path d="M904 652 L903 666 M940 652 L941 666" stroke="var(--c-scene-void)" strokeWidth="7" strokeLinecap="round" />
          </g>
        </g>

        {/* scale ticks + sector marks */}
        <g stroke="var(--c-steel)" strokeWidth="0.8" opacity="0.55">
          <path d="M40 736 L40 724 M100 736 L100 728 M160 736 L160 724 M220 736 L220 728 M280 736 L280 724" />
        </g>
        <g fill="var(--c-steel)" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2">
          <text x="40" y="752">0</text>
          <text x="268" y="752">120 m</text>
        </g>

        <rect width="1200" height="760" fill="url(#plate-fog)" />
      </svg>
    </div>
  );
}

import type { ReactNode } from "react";

export type GlyphVariant = "wave" | "lattice" | "channel" | "grid" | "convergence";

const glow = "#6fd8ec";
const steel = "#75899a";
const line = "#1d3040";

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden border border-line bg-panel/30">
      <div className="grid-field absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(90%_80%_at_70%_15%,rgba(111,216,236,0.13),transparent_70%)]"
        aria-hidden="true"
      />
      <svg viewBox="0 0 400 300" className="absolute inset-0 size-full" role="img" aria-label={label}>
        {children}
      </svg>
      <span className="absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.18em] text-steel/80">
        Model
      </span>
      <span className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.18em] text-steel/60">
        Not to scale
      </span>
    </div>
  );
}

function WaveGlyph() {
  return (
    <>
      <defs>
        <linearGradient id="wave-slab" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={glow} stopOpacity="0.05" />
          <stop offset="50%" stopColor={glow} stopOpacity="0.4" />
          <stop offset="100%" stopColor={glow} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect x="196" y="34" width="14" height="232" fill="url(#wave-slab)" />
      <line x1="196" x2="196" y1="34" y2="266" stroke={glow} strokeOpacity="0.55" />
      <line x1="210" x2="210" y1="34" y2="266" stroke={glow} strokeOpacity="0.55" />
      {[46, 78, 110, 142, 174, 206, 238, 270, 302, 334].map((y) => (
        <path
          key={y}
          d={`M 24 ${y} H 190`}
          fill="none"
          stroke={steel}
          strokeOpacity="0.55"
          strokeDasharray="3 6"
        />
      ))}
      {[54, 84, 114, 144, 174, 204, 234, 264].map((y, index) => (
        <path
          key={y}
          d={`M 212 ${y} C 280 ${y - 12 - index * 2}, 330 ${y - 26 - index * 9}, 384 ${y - 58 - index * 12}`}
          fill="none"
          stroke={glow}
          strokeOpacity={0.5 - index * 0.035}
          strokeWidth="1.2"
        />
      ))}
      <path d="M 24 60 H 160" stroke={glow} strokeOpacity="0.9" strokeWidth="1.6" />
      <text x="26" y="52" className="fill-[#75899a] font-mono text-[8px] uppercase">
        incident
      </text>
      <text x="286" y="248" className="fill-[#75899a] font-mono text-[8px] uppercase">
        phasefront
      </text>
      <circle cx="203" cy="60" r="2" fill={glow} />
    </>
  );
}

function LatticeGlyph() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, column) =>
        Array.from({ length: 6 }).map((__, row) => {
          const x = 70 + column * 28;
          const y = 70 + row * 30;
          const phase = (column * 2.1 + row * 0.6) % 3;
          return (
            <circle
              key={`${column}-${row}`}
              cx={x}
              cy={y}
              r={2.4}
              fill={glow}
              fillOpacity={0.18 + phase * 0.16}
            />
          );
        }),
      )}
      <rect x="118" y="82" width="56" height="60" fill="none" stroke={glow} strokeOpacity="0.65" strokeDasharray="3 3" />
      <rect x="118" y="82" width="56" height="60" fill={glow} fillOpacity="0.05" />
      <path d="M 118 82 L 104 68 M 174 82 L 188 68 M 118 142 L 104 156 M 174 142 L 188 156" stroke={steel} strokeOpacity="0.6" />
      <path d="M 70 52 H 322" stroke={line} />
      <path d="M 70 250 H 322" stroke={line} />
      <text x="70" y="42" className="fill-[#75899a] font-mono text-[8px] uppercase">
        unit cell · λ/6
      </text>
      <text x="250" y="276" className="fill-[#75899a] font-mono text-[8px] uppercase">
        phase gradient
      </text>
      <path d="M 250 262 H 320" stroke={glow} strokeOpacity="0.5" />
      <path d="M 320 262 L 312 259 M 320 262 L 312 265" stroke={glow} strokeOpacity="0.8" />
    </>
  );
}

function ChannelGlyph() {
  return (
    <>
      <path
        d="M 34 120 H 128 Q 146 120 146 138 V 168 Q 146 186 164 186 H 236 Q 254 186 254 168 V 138 Q 254 120 272 120 H 366"
        fill="none"
        stroke={glow}
        strokeOpacity="0.65"
        strokeWidth="1.6"
      />
      <path
        d="M 34 154 H 128 Q 146 154 146 172 V 202 Q 146 220 164 220 H 236 Q 254 220 254 202 V 172 Q 254 154 272 154 H 366"
        fill="none"
        stroke={steel}
        strokeOpacity="0.35"
        strokeWidth="1.4"
      />
      {[74, 170, 286, 336].map((x, index) => (
        <circle key={x} cx={x} cy={137 + index * 12} r={index === 1 ? 9 : 5} fill={glow} fillOpacity={index === 1 ? 0.28 : 0.14} stroke={glow} strokeOpacity="0.6" />
      ))}
      {[150, 186, 222, 258, 294].map((x) => (
        <g key={x}>
          <rect x={x} y={64} width="12" height="20" fill={glow} fillOpacity="0.18" stroke={glow} strokeOpacity="0.5" />
          <rect x={x} y={232} width="12" height="20" fill={glow} fillOpacity="0.18" stroke={glow} strokeOpacity="0.5" />
        </g>
      ))}
      <path d="M 156 84 V 232 M 288 84 V 232" stroke={glow} strokeOpacity="0.22" strokeDasharray="2 5" />
      <text x="34" y="60" className="fill-[#75899a] font-mono text-[8px] uppercase">
        electrode pair
      </text>
      <text x="290" y="282" className="fill-[#75899a] font-mono text-[8px] uppercase">
        Δc → Δf
      </text>
    </>
  );
}

function GridGlyph() {
  return (
    <>
      {Array.from({ length: 13 }).map((_, index) => (
        <line
          key={`v-${index}`}
          x1={52 + index * 24}
          x2={52 + index * 24}
          y1={44}
          y2={256}
          stroke={line}
          strokeOpacity={0.8}
        />
      ))}
      {Array.from({ length: 9 }).map((_, index) => (
        <line
          key={`h-${index}`}
          x1={52}
          x2={340}
          y1={44 + index * 26.5}
          y2={44 + index * 26.5}
          stroke={line}
          strokeOpacity={0.8}
        />
      ))}
      {[2, 3, 4, 5, 6].map((radius) =>
        [4, 5, 6, 7].map((column) =>
          [-1, 1].map((direction) => (
            <path
              key={`${radius}-${column}-${direction}`}
              d={`M ${196 + direction * radius * 16} ${150 - radius * 8} q ${direction * 30} ${radius * 10}, ${direction * 52} 0`}
              fill="none"
              stroke={glow}
              strokeOpacity={0.16 + radius * 0.02}
            />
          )),
        ),
      )}
      <circle cx="196" cy="150" r="4" fill={glow} fillOpacity="0.9" />
      <circle cx="196" cy="150" r="10" fill="none" stroke={glow} strokeOpacity="0.35" />
      <path d="M 196 150 L 268 108" stroke={glow} strokeOpacity="0.45" strokeDasharray="2 4" />
      <text x="272" y="104" className="fill-[#75899a] font-mono text-[8px] uppercase">
        E
      </text>
      <text x="52" y="36" className="fill-[#75899a] font-mono text-[8px] uppercase">
        Yee lattice · Δx
      </text>
    </>
  );
}

function ConvergenceGlyph() {
  return (
    <>
      <path d="M 56 44 V 244 H 352" fill="none" stroke={steel} strokeOpacity="0.5" />
      {[0, 1, 2, 3, 4].map((index) => (
        <g key={index}>
          <line x1="56" x2="352" y1={64 + index * 42} y2={64 + index * 42} stroke={line} />
          <text x="42" y={68 + index * 42} textAnchor="end" className="fill-[#75899a] font-mono text-[8px]">
            {`1e-${index + 1}`}
          </text>
        </g>
      ))}
      <path
        d="M 56 232 C 96 208, 118 196, 142 172 S 190 128, 218 112 S 274 96, 306 90 S 336 86, 348 84"
        fill="none"
        stroke={glow}
        strokeWidth="1.6"
        strokeOpacity="0.85"
      />
      {[142, 218, 306].map((x, index) => (
        <circle key={x} cx={x} cy={[172, 112, 90][index]} r="2.6" fill={glow} />
      ))}
      <line x1="56" x2="352" y1="126" y2="126" stroke={glow} strokeOpacity="0.4" strokeDasharray="4 5" />
      <text x="300" y="120" className="fill-[#75899a] font-mono text-[8px] uppercase">
        tol
      </text>
      <text x="300" y="232" className="fill-[#75899a] font-mono text-[8px] uppercase">
        iterations
      </text>
      <path d="M 56 244 H 352" stroke={steel} strokeOpacity="0.5" />
    </>
  );
}

const glyphs: Record<GlyphVariant, () => ReactNode> = {
  wave: WaveGlyph,
  lattice: LatticeGlyph,
  channel: ChannelGlyph,
  grid: GridGlyph,
  convergence: ConvergenceGlyph,
};

export default function ResearchGlyph({ variant, label }: { variant: GlyphVariant; label: string }) {
  const Glyph = glyphs[variant] ?? WaveGlyph;
  return (
    <Frame label={label}>
      <Glyph />
    </Frame>
  );
}

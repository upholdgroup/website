/**
 * A hand-drawn line-art construction site that pans slowly across the horizon.
 *
 * The page renders this with CSS custom properties so it re-themes for free.
 * `next/og` (satori) cannot resolve custom properties, so every symbol takes an
 * explicit `Palette` instead — that lets the social card reuse this exact
 * artwork rather than keeping a second, drifting copy of it.
 *
 * Geometry: each symbol is drawn with its own origin sitting on the ground line
 * (y = 0, building upward into negative y) and is then placed with
 * translate(x, GROUND). GROUND is the bottom edge of the viewBox, so the tiles
 * butt up against the container's border-b, which draws the horizon.
 */

export type Palette = {
  line: string;
  fill: string;
  paper: string;
};

/** Themed palette for the live page. */
export const cssPalette: Palette = {
  line: "var(--brand-line)",
  fill: "var(--brand)",
  paper: "var(--background)",
};

export const TILE_W = 1920;
export const TILE_H = 320;
const GROUND = TILE_H;

type P = { c: Palette };

/* -------------------------------------------------------------------------- */
/* Symbols                                                                     */
/* -------------------------------------------------------------------------- */

function House({ c }: P) {
  return (
    <g>
      {/* garage annex */}
      <path d="M-104 0V-64h98" />
      <path d="M-94 0v-50h78v50" />
      <path d="M-94-36h78M-94-22h78" />
      {/* body */}
      <path d="M-6 0v-86h156v86" />
      {/* roof */}
      <path d="M-22-84 72-146l94 62z" fill={c.fill} stroke="none" />
      <path d="M-22-84h188" />
      {/* attic window */}
      <rect x="62" y="-125" width="20" height="21" fill={c.paper} />
      <path d="M72-125v21M62-114.5h20" />
      {/* windows */}
      <rect x="10" y="-72" width="34" height="28" />
      <path d="M27-72v28M10-58h34" />
      <rect x="104" y="-72" width="34" height="28" />
      <path d="M121-72v28M104-58h34" />
      {/* door */}
      <path d="M60 0v-46h28v46" />
      <circle cx="82.5" cy="-23" r="1.8" fill={c.line} stroke="none" />
      <path d="M52 0h44" />
    </g>
  );
}

function Crane({ c }: P) {
  const rungs = [];
  for (let y = -24; y > -214; y -= 26) {
    rungs.push(<path key={y} d={`M0 ${y}h22M0 ${y}l22 -26M22 ${y}L0 ${y - 26}`} />);
  }
  return (
    <g>
      {/* base + mast */}
      <path d="M-16 0h54M-6 0v-12h34v12" />
      <path d="M0-12v-206M22-12v-206" />
      {rungs}
      {/* slewing unit + apex */}
      <path d="M-4-218h30v-22H-4z" />
      <path d="M2-240 11-288l9 48" />
      {/* jib truss */}
      <path d="M-74-240h286M-58-254h198" />
      <path d="M-58-254-40-240M-20-254-2-240M20-254 38-240M60-254 78-240M100-254l18 14M140-254l18 14" />
      {/* counterweight */}
      <path d="M-74-240v-24h32v24z" fill={c.fill} stroke="none" />
      {/* tie cables */}
      <path d="M11-288-56-254M11-288l129 34" />
      {/* trolley, cable, hook block, load */}
      <path d="M142-240v-8h16v8" />
      <path d="M150-240v90" />
      <path d="M138-150h24v10h-24z" />
      <path d="M112-134h76v12h-76z" fill={c.fill} stroke="none" />
      <path d="M138-140v6M162-140v6" />
    </g>
  );
}

function Mixer({ c }: P) {
  return (
    <g>
      {/* chassis + wheels */}
      <path d="M16-34h210" />
      <circle cx="52" cy="-18" r="18" />
      <circle cx="52" cy="-18" r="6" />
      <circle cx="162" cy="-18" r="18" />
      <circle cx="162" cy="-18" r="6" />
      <circle cx="202" cy="-18" r="18" />
      <circle cx="202" cy="-18" r="6" />
      {/* cab */}
      <path d="M160-34v-72h48l18 30v42" />
      <path d="M168-98h32v22h-32z" fill={c.paper} />
      {/* drum supports */}
      <path d="M62-56 56-34M138-56l8 22" />
      {/* drum */}
      <g transform="rotate(-12 96 -86)">
        <rect x="44" y="-116" width="104" height="60" rx="30" fill={c.fill} stroke="none" />
        <path d="M72-114q16 28 0 56M106-114q16 28 0 56" fill="none" stroke={c.paper} strokeWidth="3.5" />
      </g>
      {/* charging hopper + discharge chute */}
      <path d="M24-128h34l-8 22H32z" fill={c.fill} stroke="none" />
      <path d="M36-70 14-44l-10-6" />
    </g>
  );
}

function Excavator({ c }: P) {
  return (
    <g>
      {/* track */}
      <path d="M18 0h86a17 17 0 0 0 0-34H18a17 17 0 0 0 0 34z" />
      <circle cx="27" cy="-17" r="7" />
      <circle cx="95" cy="-17" r="7" />
      <circle cx="55" cy="-17" r="4" />
      <circle cx="74" cy="-17" r="4" />
      {/* superstructure */}
      <path d="M24-34v-30a6 6 0 0 1 6-6h20v-14h44v50" />
      <path d="M58-78h30v26H58z" fill={c.paper} />
      {/* boom, arm, bucket */}
      <path d="M92-58 128-108" stroke={c.fill} strokeWidth="9" />
      <path d="M128-108 158-68" stroke={c.fill} strokeWidth="7" />
      <path d="M114-98 100-78" strokeWidth="3" />
      <path d="M158-68 176-52l-12 18-22-8z" fill={c.fill} stroke="none" />
    </g>
  );
}

function Worker({ c }: P) {
  return (
    <g>
      <circle cx="0" cy="-44" r="5.5" />
      <path d="M-9-48a9 9 0 0 1 18 0z" fill={c.fill} stroke="none" />
      <path d="M-11.5-48h23" />
      <path d="M0-38v19" />
      <path d="M0-19-7 0M0-19 7 0" />
      <path d="M-9-24 0-34l11-8" />
    </g>
  );
}

function Scaffold({ c }: P) {
  return (
    <g>
      <path d="M0 0v-120M46 0v-120M92 0v-120" />
      <path d="M0-42h92M0-82h92M0-120h92" />
      <path d="M0-42 46-82M46-42 0-82" />
      {/* plank, overhanging its bearers */}
      <path d="M-8-89h108v7H-8z" fill={c.fill} stroke="none" />
      {/* ladder in the right bay */}
      <path d="M58-42v-40M82-42v-40M58-54h24M58-66h24" />
    </g>
  );
}

function Stake({ c }: P) {
  return (
    <g>
      <path d="M0 0v-76" />
      <path d="M0-76 26-68 0-60z" fill={c.fill} stroke="none" />
    </g>
  );
}

function Pipes() {
  return (
    <g>
      <circle cx="12" cy="-12" r="12" />
      <circle cx="37" cy="-12" r="12" />
      <circle cx="24.5" cy="-33" r="12" />
    </g>
  );
}

function Hoarding() {
  return (
    <g>
      <path d="M0-54h124v54H0z" />
      <path d="M0 0 34-54M30 0 64-54M60 0 94-54M90 0l34-54" strokeWidth="1.4" />
      <path d="M0-54v-8M124-54v-8" />
    </g>
  );
}

function Bush({ c, w = 56 }: P & { w?: number }) {
  return <path d={`M0 0a${w / 2} ${w * 0.38} 0 0 1 ${w} 0z`} fill={c.fill} stroke="none" />;
}

function Mound({ c }: P) {
  return <path d="M0 0q34-18 68 0z" fill={c.fill} stroke="none" opacity="0.55" />;
}

function Pine({ c }: P) {
  return (
    <g>
      <path d="M0 0v-16" />
      <path d="M-21-14 0-60l21 46z" fill={c.fill} stroke="none" />
      <path d="M-16-36 0-76l16 40z" fill={c.fill} stroke="none" />
    </g>
  );
}

function Oak({ c }: P) {
  return (
    <g>
      <path d="M0 0v-22" />
      <circle cx="0" cy="-42" r="22" fill={c.fill} stroke="none" />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Tiles                                                                       */
/* -------------------------------------------------------------------------- */

function At({ x, scale = 1, children }: { x: number; scale?: number; children: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${GROUND})${scale === 1 ? "" : ` scale(${scale})`}`}>
      {children}
    </g>
  );
}

/** The repeating foreground tile. Everything sits inside 0…TILE_W so the loop
 *  never clips a symbol at the seam. */
export function SceneTile({ c = cssPalette }: { c?: Palette }) {
  return (
    <g fill="none" stroke={c.line} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <At x={100}><Crane c={c} /></At>
      <At x={250}><House c={c} /></At>
      <At x={470}><Worker c={c} /></At>
      <At x={500}><Mound c={c} /></At>
      <At x={600}><Scaffold c={c} /></At>
      <At x={740}><Stake c={c} /></At>
      <At x={790}><Bush c={c} w={48} /></At>
      <At x={880}><Mixer c={c} /></At>
      <At x={1150}><Mound c={c} /></At>
      <At x={1175}><Bush c={c} w={40} /></At>
      <At x={1260}><Pipes /></At>
      <At x={1360}><Excavator c={c} /></At>
      <At x={1580}><Pine c={c} /></At>
      <At x={1630}><Bush c={c} w={56} /></At>
      <At x={1740}><Hoarding /></At>
    </g>
  );
}

/** Slower, smaller planting that reads as distance. */
function FarTile({ c }: P) {
  return (
    <g fill="none" stroke={c.line} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <At x={40} scale={0.62}><Oak c={c} /></At>
      <At x={190} scale={0.62}><Bush c={c} w={56} /></At>
      <At x={330} scale={0.62}><Pine c={c} /></At>
      <At x={430} scale={0.62}><Bush c={c} w={40} /></At>
      <At x={640} scale={0.62}><Oak c={c} /></At>
      <At x={760} scale={0.62}><Bush c={c} w={48} /></At>
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Scene                                                                       */
/* -------------------------------------------------------------------------- */

const SCENE_H = "h-[150px] sm:h-[200px] md:h-[250px] lg:h-[290px]";

function Track({
  className,
  tile,
  width,
}: {
  className: string;
  tile: React.ReactNode;
  width: number;
}) {
  return (
    <div className={`absolute bottom-0 flex w-max ${className}`}>
      {/* Three identical tiles: shifting the track by exactly -33.3333% equals
          one tile width at any rendered scale, so the loop is seamless. */}
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          viewBox={`0 0 ${width} ${TILE_H}`}
          aria-hidden="true"
          className={`block w-auto ${SCENE_H}`}
        >
          {tile}
        </svg>
      ))}
    </div>
  );
}

export function ConstructionScene() {
  return (
    <div
      className={`relative w-full overflow-hidden border-b border-rule ${SCENE_H}`}
      role="img"
      aria-label="A construction site with a tower crane, a house being built, a cement mixer and an excavator, drifting slowly across the horizon."
    >
      <div className="absolute inset-0 opacity-45">
        <Track className="animate-pan-far" tile={<FarTile c={cssPalette} />} width={900} />
      </div>
      <Track className="animate-pan" tile={<SceneTile />} width={TILE_W} />
    </div>
  );
}

import Image from "next/image";

/**
 * A photo slot.
 *
 * The design system calls for real crews on real Sydney sites and explicitly
 * forbids stock hi-vis, so until the photography exists this renders a drawn
 * placeholder rather than a bought lie: line-art site geometry on the warm
 * grey surface, with a mono caption naming the shot that belongs here.
 *
 * Pass `src` (a file in /public, or a remote URL configured in next.config)
 * and the placeholder is replaced with an optimised <Image>. Nothing else
 * about the layout changes, which is what let the real photography drop in
 * later without touching a single layout.
 */
export function SitePhoto({
  caption,
  src,
  alt,
  priority = false,
  className = "",
  radius = "rounded-hero",
  tone = "grey",
  seed = 0,
  sizes = "(min-width: 1760px) 1600px, 100vw",
  position,
}: {
  /** What this shot must show. Rendered as the placeholder label. */
  caption: string;
  src?: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  radius?: string;
  tone?: "grey" | "ink";
  /** Shifts the skyline so repeated slots on one page do not look copy-pasted. */
  seed?: number;
  /** Tell the optimiser how wide this slot actually is, so it stops shipping
   *  a 1240px file to a 90px thumbnail. */
  sizes?: string;
  /** object-position, for crops that would otherwise cut a face off. */
  position?: string;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${radius} ${className}`}>
        <Image
          src={src}
          alt={alt ?? caption}
          fill
          priority={priority}
          sizes={sizes}
          style={position ? { objectPosition: position } : undefined}
          className="object-cover"
        />
      </div>
    );
  }

  const ink = tone === "ink";

  return (
    <div
      role="img"
      aria-label={`Placeholder for site photography: ${caption}`}
      className={`relative overflow-hidden ${radius} ${
        ink ? "bg-ink" : "bg-surface-2"
      } ${className}`}
    >
      <SiteLineArt seed={seed} ink={ink} />

      {caption && (
        <>
          {/* Gradient scrim, overlay text never sits directly on artwork. */}
          <div
            aria-hidden="true"
            className={`absolute inset-x-0 bottom-0 h-[38%] ${
              ink
                ? "bg-gradient-to-t from-ink via-ink/70 to-transparent"
                : "bg-gradient-to-t from-surface-2 via-surface-2/70 to-transparent"
            }`}
          />
          <p
            className={`eyebrow absolute right-4 bottom-4 left-4 md:right-6 md:bottom-6 md:left-6 ${
              ink ? "text-white/55" : "text-ink-45"
            }`}
          >
            {caption}
          </p>
        </>
      )}
    </div>
  );
}

/**
 * Line-art site geometry: a horizon, tower cranes, scaffold bays and a hoarding
 * line. Drawn once as a wide viewBox and stretched with `preserveAspectRatio`
 * so a 21:9 hero and a 4:3 tile both crop it sensibly.
 */
function SiteLineArt({ seed, ink }: { seed: number; ink: boolean }) {
  const stroke = ink ? "#ffffff" : "#111111";
  const accent = "#e85f2c";
  const offset = (seed * 137) % 320;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1240 420"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 h-full w-full"
    >
      <g transform={`translate(${-offset} 0)`} stroke={stroke} fill="none" strokeWidth="1.5">
        {/* Distant skyline, thin, low opacity, sits behind everything. */}
        <g opacity={ink ? 0.28 : 0.16}>
          <path d="M-60 300h90v-96h64v56h58v-118h74v158h96v-70h70v70h120v-134h66v134h150v-58h84v58h150v-92h72v92h160" />
          <path d="M53 204v96M111 260v40M243 146v154M409 230v70M595 166v134M829 262v38M1063 208v92" />
        </g>

        {/* Scaffold bay, the repeating grid a Sydney remedial site actually is. */}
        <g opacity={ink ? 0.45 : 0.3}>
          <path d="M96 420V172h336v248" />
          <path d="M96 234h336M96 296h336M96 358h336" />
          <path d="M180 172v248M264 172v248M348 172v248" />
          <path d="M96 172l84 62M180 172l84 62M264 172l84 62M96 234l84 62M180 234l84 62M264 234l84 62M96 296l84 62M180 296l84 62" />
        </g>

        {/* Structure under construction, slab lines, columns, a stair core. */}
        <g opacity={ink ? 0.5 : 0.34}>
          <path d="M470 420V214h204v206" />
          <path d="M470 266h204M470 318h204M470 370h204" />
          <path d="M521 214v206M572 214v206M623 214v206" />
          <path d="M674 214h44v206h-44" />
          <path d="M674 266h44M674 318h44M674 370h44" />
        </g>

        {/* Tower crane. */}
        <g opacity={ink ? 0.62 : 0.46}>
          <path d="M760 420V96" />
          <path d="M736 128h48M736 176h48M736 224h48M736 272h48M736 320h48M736 368h48" />
          <path d="M760 96h268M760 96H636" />
          <path d="M760 80l268 16M760 80l-124 16" />
          <path d="M900 96v52" />
          <path d="M884 148h32v24h-32z" />
        </g>

        {/* Second crane, further back and smaller. */}
        <g opacity={ink ? 0.32 : 0.22}>
          <path d="M1078 420V162" />
          <path d="M1060 196h36M1060 242h36M1060 288h36M1060 334h36" />
          <path d="M1078 162h158M1078 162h-76" />
          <path d="M1174 162v38" />
        </g>

        {/* Site shed and material stacks, the things that make a site read as
            a working site rather than an architectural rendering. */}
        <g opacity={ink ? 0.42 : 0.28}>
          <path d="M188 420v-52h104v52M188 384h104" />
          <path d="M900 420v-30h84v30M900 405h84M928 390v30M956 390v30" />
          <path d="M1140 420v-22h70v22M1140 409h70" />
        </g>

        {/* Hoarding along the frontage, one continuous line, panelled. */}
        <g opacity={ink ? 0.35 : 0.24}>
          <path d="M-60 420v-34h1600v34" />
          <path d="M20 386v34M140 386v34M260 386v34M380 386v34M500 386v34M620 386v34M740 386v34M860 386v34M980 386v34M1100 386v34M1220 386v34M1340 386v34" />
        </g>

        {/* Ground line, one continuous horizon, the way the system asks. */}
        <path d="M-60 420h1600" strokeWidth="2" opacity={ink ? 0.55 : 0.4} />

        {/* One orange element: the load on the hook. Never more than one. */}
        <g stroke={accent} strokeWidth="2.5" opacity="0.95">
          <path d="M900 148V96" />
          <path d="M884 172h32" />
        </g>
      </g>
    </svg>
  );
}

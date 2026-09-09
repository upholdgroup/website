import { ImageResponse } from "next/og";
import { SceneTile, type Palette } from "@/components/ConstructionScene";
import { renderSvgMarkup } from "@/lib/svg";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — Under Construction`;

/* satori cannot resolve CSS custom properties, so the card gets the light
   palette as literals — same artwork, same values as :root in globals.css. */
const palette: Palette = { line: "#35a862", fill: "#1c8f4b", paper: "#ffffff" };

/* satori renders SVG as opaque markup and will not expand React components
   nested inside it, so the scene is serialised to a standalone SVG and handed
   over as a data URI. */
const SCENE_W = 1072;
const SCENE_H = 277;
const sceneSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${SCENE_W}" height="${SCENE_H}" viewBox="20 20 1160 300">` +
  renderSvgMarkup(<SceneTile c={palette} />) +
  "</svg>";
const sceneUri = `data:image/svg+xml;base64,${Buffer.from(sceneSvg).toString("base64")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "56px 64px 64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: 6, color: "#16191c" }}>
            UPHOLD
          </div>
          <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: 13, color: "#1c8f4b" }}>
            GROUP
          </div>
        </div>

        {/* A slice of the real scene: crane, house, worker, scaffold, mixer. */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={sceneUri} width={SCENE_W} height={SCENE_H} alt="" />
          <div style={{ display: "flex", width: SCENE_W, height: 2, background: "#dfe3e0" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 44, color: "#16191c" }}>{site.headline}</div>
          <div
            style={{
              display: "flex",
              width: 360,
              height: 12,
              borderRadius: 6,
              background: "#e6f2e9",
              marginTop: 26,
            }}
          >
            <div style={{ width: 245, height: 12, borderRadius: 6, background: "#1c8f4b" }} />
          </div>
        </div>
      </div>
    ),
    size,
  );
}

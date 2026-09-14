import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name}, construction labour hire, Greater Sydney`;

export default async function OpengraphImage() {
  // Read from /public rather than duplicating the path data. Satori cannot
  // fetch a relative URL, so it goes in as a data URI.
  const mark = await readFile(join(process.cwd(), "public", "uphold-icon.svg"), "utf8");
  const markSrc = `data:image/svg+xml;base64,${Buffer.from(mark).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111111",
          padding: 72,
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src={markSrc} width={56} height={56} alt="" />
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: 0.5,
            }}
          >
            <span>UPHOLD GROUP</span>
            <span style={{ color: "#e85f2c" }}>.</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 88,
              lineHeight: 1,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -3.5,
            }}
          >
            Crews That Turn Up.
          </div>
          <div style={{ fontSize: 30, color: "#a5a5a0", maxWidth: 900, lineHeight: 1.4 }}>
            Construction labour hire &amp; recruitment across Greater Sydney. Most requests filled
            within four hours.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, fontSize: 20, color: "#a5a5a0" }}>
          {["Sydney owned & run", "We employ the crew", "Tickets verified"].map((chip) => (
            <div
              key={chip}
              style={{
                border: "1px solid #3a3a37",
                borderRadius: 999,
                padding: "10px 20px",
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}

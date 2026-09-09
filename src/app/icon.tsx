import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#16191c",
          borderRadius: 12,
        }}
      >
        <svg width="44" height="44" viewBox="0 0 38 38" fill="none">
          <path
            d="M9.5 23.5 19 13l9.5 10.5"
            stroke="#3fbc72"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M11.5 29h15" stroke="#3fbc72" strokeWidth="3.4" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}

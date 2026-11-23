import { ImageResponse } from "next/og";

// Home screen icon for iPhone and iPad (180x180, static at build time)
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 30% 20%, #1c4a37 0%, #0f1a14 55%, #090e0b 100%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 66, fontWeight: 700, letterSpacing: 6, color: "#f4f7f4", lineHeight: 1 }}>PC</div>
          <div style={{ marginTop: 10, width: 44, height: 4, borderRadius: 2, background: "#34c48c" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}

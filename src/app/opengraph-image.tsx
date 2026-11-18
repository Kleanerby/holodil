import { ImageResponse } from "next/og";

export const alt = "Ремонт холодильников в Минске на дому";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Встроенный шрифт ImageResponse не содержит кириллицу, поэтому текст латиницей.
// TODO(brand): подключить кириллический шрифт (fonts: [...]) или заменить на готовый макет.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#060a12", color: "#eaf1f8", padding: 72, position: "relative" }}>
        <div style={{ position: "absolute", right: -160, top: -200, width: 760, height: 760, borderRadius: 9999, background: "rgba(111,220,255,0.16)" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 720 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "#6fdcff", display: "flex", alignItems: "center", justifyContent: "center", color: "#060a12", fontSize: 40, fontWeight: 700 }}>*</div>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 2 }}>POLUS</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2 }}>Fridge repair</div>
            <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2, color: "#6fdcff" }}>in Minsk</div>
            <div style={{ marginTop: 28, fontSize: 30, color: "#8b9ab0" }}>At home in 1–2 hours · from 30 BYN · warranty up to 24 months</div>
          </div>
        </div>
        {/* силуэт холодильника */}
        <div style={{ position: "absolute", right: 150, top: 90, width: 230, height: 450, borderRadius: 26, background: "linear-gradient(160deg,#dfe6ee,#8c98a6)", display: "flex", flexDirection: "column", boxShadow: "0 0 120px rgba(111,220,255,0.45)" }}>
          <div style={{ height: 286, borderBottom: "5px solid #060a12", display: "flex" }}>
            <div style={{ marginLeft: 24, marginTop: 150, width: 9, height: 100, borderRadius: 6, background: "#1a1f27" }} />
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ marginLeft: 24, marginTop: 26, width: 9, height: 80, borderRadius: 6, background: "#1a1f27" }} />
          </div>
        </div>
      </div>
    ),
    size,
  );
}

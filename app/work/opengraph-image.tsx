import { captureOgScreenshot } from "@/lib/og-screenshot";
import { headers } from "next/headers";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const alt = "Yashvanth S - Full-Stack Developer & AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  const origin = host ? `${proto}://${host}` : undefined;

  try {
    const png = await captureOgScreenshot("/work", origin);

    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#FFF1F2",
            color: "#1f0208",
            fontSize: 56,
            fontWeight: 700,
            fontFamily: "ui-monospace, monospace",
          }}
        >
          My Work
        </div>
      ),
      { ...size }
    );
  }
}

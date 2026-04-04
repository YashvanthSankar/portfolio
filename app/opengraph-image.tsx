import { captureOgScreenshot } from "@/lib/og-screenshot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const alt = "Yashvanth S - Full-Stack Developer & AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const png = await captureOgScreenshot("/");

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

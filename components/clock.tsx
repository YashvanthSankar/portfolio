"use client";

import { useEffect, useState } from "react";

/** The local time in Chennai, refreshed every half minute. */
export function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return <span className="tabular-nums">{time ? `${time} IST` : "IST"}</span>;
}

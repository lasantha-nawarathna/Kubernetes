"use client";

import { useEffect, useRef, useState } from "react";
import { img } from "@/lib/data";
import { cn } from "@/lib/cn";

const tones = ["bg-emerald-100 text-emerald-700", "bg-sky-100 text-sky-700", "bg-violet-100 text-violet-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700"];

export function Avatar({ src, name, size = 40, className }: { src?: string; name: string; size?: number; className?: string }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // The image may finish (or fail) before hydration attaches onLoad/onError.
  useEffect(() => {
    const el = ref.current;
    if (el?.complete) el.naturalWidth > 0 ? setLoaded(true) : setFailed(true);
  }, []);
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const tone = tones[name.length % tones.length];
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold", tone, className)}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
      {src && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={img(src, size * 3)}
          alt={name}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn("absolute inset-0 h-full w-full object-cover transition-opacity", loaded ? "opacity-100" : "opacity-0")}
        />
      )}
    </span>
  );
}

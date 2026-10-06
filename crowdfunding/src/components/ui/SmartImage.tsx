"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { img } from "@/lib/data";
import { cn } from "@/lib/cn";

const gradients = [
  "from-emerald-400 via-teal-500 to-sky-600",
  "from-amber-400 via-orange-500 to-rose-500",
  "from-violet-500 via-fuchsia-500 to-pink-500",
  "from-sky-400 via-indigo-500 to-violet-600",
  "from-lime-400 via-emerald-500 to-teal-600",
  "from-rose-400 via-red-500 to-orange-500",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Campaign photo with a graceful branded placeholder when the image is
 * missing or fails to load (e.g. offline demos).
 */
export function SmartImage({
  src,
  alt,
  width = 1200,
  className,
  imgClassName,
}: {
  src: string;
  alt: string;
  width?: number;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  const url = img(src, width);
  const g = gradients[hash(alt) % gradients.length];

  // The image may finish (or fail) before hydration attaches onLoad/onError.
  useEffect(() => {
    const el = ref.current;
    if (el?.complete) el.naturalWidth > 0 ? setLoaded(true) : setFailed(true);
  }, [url]);

  return (
    <div className={cn("@container relative overflow-hidden bg-gradient-to-br", g, className)}>
      {(!url || failed) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/90">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />
          <ImageIcon className="h-5 w-5 @[12rem]:h-8 @[12rem]:w-8" strokeWidth={1.5} />
          <span className="mt-2 hidden max-w-[80%] truncate text-xs font-medium @[12rem]:block">{alt}</span>
        </div>
      )}
      {url && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={url}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      )}
    </div>
  );
}

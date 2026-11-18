"use client";

import dynamic from "next/dynamic";
import type { FridgeSceneProps } from "./FridgeScene";

const Scene = dynamic(() => import("./FridgeScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">
      <div className="h-2/3 w-1/3 animate-pulse rounded-2xl bg-white/5" />
    </div>
  ),
});

/** Ленивая обёртка: three.js грузится только в браузере и отдельным чанком */
export function Fridge3D(props: FridgeSceneProps) {
  return <Scene {...props} />;
}

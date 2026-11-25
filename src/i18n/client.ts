"use client";

import { usePathname } from "next/navigation";
import { langFromPath, type Lang } from "./config";
import { dict } from "./dict";

/** Current language, from the address (/ms/... is Bahasa Melayu) */
export function useLang(): Lang {
  return langFromPath(usePathname());
}

export function useT() {
  return dict(useLang());
}

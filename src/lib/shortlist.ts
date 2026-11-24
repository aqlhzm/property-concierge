"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * The buyer's shortlist lives only on their own device (no account, no personal data) until they choose
 * to send it with an enquiry. Items are unit type ids (e.g. "ap-a1") or development slugs (e.g. "airria-plus").
 */
const KEY = "pc-shortlist-v1";
const EVENT = "pc-shortlist-change";
export const SHORTLIST_MAX = 12;

function readRaw(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

export function parseShortlist(raw: string | null | undefined): string[] {
  try {
    const v = JSON.parse(raw ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && /^[a-z0-9-]{1,40}$/.test(x)).slice(0, SHORTLIST_MAX) : [];
  } catch {
    return [];
  }
}

function write(list: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...new Set(list)].slice(0, SHORTLIST_MAX)));
  } catch {
    /* storage unavailable (private mode): the change simply isn't kept */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function toggleShortlist(id: string) {
  const list = parseShortlist(readRaw());
  write(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
}

export function addToShortlist(ids: string[]) {
  write([...parseShortlist(readRaw()), ...ids]);
}

export function removeFromShortlist(id: string) {
  write(parseShortlist(readRaw()).filter((x) => x !== id));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Saved ids on this device; empty during server render and before hydration. */
export function useShortlist(): string[] {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  return useMemo(() => parseShortlist(raw), [raw]);
}

/** Split saved ids into developments and unit types, against the known catalogue */
export function splitShortlist(ids: string[], projectSlugs: string[], unitIds: string[]) {
  return {
    developments: ids.filter((id) => projectSlugs.includes(id)),
    unitTypes: ids.filter((id) => unitIds.includes(id)),
  };
}

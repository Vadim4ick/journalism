"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "journalism-front:cookie-accepted";
const CHANGE_EVENT = "journalism-front:cookie-accepted-changed";

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function useCookieAcceptance() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export function acceptCookies() {
  try {
    window.localStorage.setItem(STORAGE_KEY, "true");
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

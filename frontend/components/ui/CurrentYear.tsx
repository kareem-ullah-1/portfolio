'use client';

import { useSyncExternalStore } from 'react';

const BUILD_YEAR = new Date().getFullYear();
const subscribe = () => () => {};

/** Prerendered with the build year, then corrected to the visitor's current year after hydration. */
export function CurrentYear() {
  const year = useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => BUILD_YEAR);
  return <>{year}</>;
}

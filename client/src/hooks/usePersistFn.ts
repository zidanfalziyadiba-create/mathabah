import { useCallback, useEffect, useRef } from "react";

type AnyFunction = (...args: any[]) => any;

/** Keep a stable callback identity while always invoking the latest function. */
export function usePersistFn<T extends AnyFunction>(fn: T): T {
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  return useCallback(((...args: Parameters<T>) => fnRef.current(...args)) as T, []);
}

import React from 'react';
import useEnhancedEffect from './useEnhancedEffect';

export function useCallbackRef<T extends (...args: any[]) => any>(
  fn: T | undefined,
  deps: React.DependencyList = []
): T {
  const ref = React.useRef(fn);

  useEnhancedEffect(() => {
    ref.current = fn;
  });

  return React.useCallback(((...args) => ref.current?.(...args)) as T, deps);
}

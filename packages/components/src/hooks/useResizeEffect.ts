import { DependencyList, RefObject } from 'react';
import useEnhancedEffect from './useEnhancedEffect';
import useLatest from './useLatest';

export interface Rect {
  width: number;
  height: number;
}

export interface OnResize {
  (event: Rect): void;
}

function useResizeEffect<T extends HTMLElement>(
  ref: RefObject<T>,
  cb: OnResize,
  deps: DependencyList
): void {
  const cbRef = useLatest(cb);

  useEnhancedEffect(() => {
    if (!ref?.current) return () => null;

    const observer = new ResizeObserver(([{ contentRect }]) => {
      const { width, height } = contentRect;
      cbRef.current({ width, height });
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [cbRef, ref, ...deps]);
}

export default useResizeEffect;

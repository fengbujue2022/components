import React from 'react';

export interface VirtualizedListProps {}

function useVirtual() {
  const scrollKey = 'scrollTop';
  const boxRef = React.useRef<HTMLElement>(null);

  const measureItem = () => {};

  const scrollTo = React.useCallback(
    (offset: number) => {
      if (boxRef.current) {
        boxRef.current[scrollKey] = offset;
      }
    },
    [scrollKey]
  );

  const scrollToOffset = React.useCallback(
    (offset: number) => {
      scrollTo(offset);
    },
    [scrollTo]
  );

  const scrollToIndex = React.useCallback((index: number) => {
  }, []);

  return {
    scrollToOffset,
    scrollToIndex,
  };
}

export default function VirtualizedList() {
  return <></>;
}

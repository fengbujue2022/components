import React from 'react';
import useEnhancedEffect from '../hooks/useEnhancedEffect';
import useResizeEffect, { Rect } from '../hooks/useResizeEffect';

interface State {
  items: MeasuredItem[];
  contentSize: number;
  contentMargin: number;
}

interface Options {
  itemCount: number;
  getItemSize: (index: number, width: number) => number;
}

interface MeasuredItem {
  index: number;
  size: number;
  start: number;
  end: number;
}

const BUFFER_FACTOR = 1.5;

function binarySearch({
  low,
  high,
  compare,
}: {
  low: number;
  high: number;
  compare: (mid: number) => number;
}) {
  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);
    const compareResult = compare(middle);

    if (compareResult > 0) {
      high = middle - 1;
    } else if (compareResult < 0) {
      low = middle + 1;
    } else {
      return middle;
    }
  }

  if (low > 0) {
    return low - 1;
  }

  //not found :)
  return 0;
}

function exponentialSearch({
  index,
  high,
  compare,
}: {
  index: number;
  high: number;
  compare: (index: number) => number;
}) {
  let interval = 1;
  let newIndex = index;
  while (newIndex < high && compare(newIndex) < 0) {
    index = newIndex;
    newIndex += interval;
    interval *= 2;
  }

  return binarySearch({
    low: index,
    high: high,
    compare,
  });
}

function shouldUpdate(
  prev: MeasuredItem[],
  next: MeasuredItem[],
  skip: Record<string, boolean>
): boolean {
  if (prev.length !== next.length) return true;

  for (let i = 0; i < prev.length; i += 1)
    if (
      Object.keys(prev[i]).some((key) => {
        const k = key as keyof MeasuredItem;
        return !skip[k] && prev[i][k] !== next[i][k];
      })
    )
      return true;

  return false;
}

function useVirtual<
  B extends HTMLElement = HTMLElement,
  C extends HTMLElement = B
>(options: Options) {
  const { itemCount, getItemSize } = options;

  const [state, setState] = React.useState<State>({
    items: [],
    contentSize: 0,
    contentMargin: 0,
  });

  const scrollKey = 'scrollTop';
  const sizeKey = 'height';
  const marginKey = 'marginTop';
  const boxRef = React.useRef<B>(null);
  const contentRef = React.useRef<C>(null);
  const measuredItemsRef = React.useRef<MeasuredItem[]>([]);
  const boxRectRef = React.useRef<Rect>({
    width: 0,
    height: 0,
  });
  const scrollOffsetRef = React.useRef(0);
  const totalSizeRef = React.useRef(0);

  const getItemSizeInternal = React.useCallback(
    (index: number) => {
      const { current: rect } = boxRectRef;
      return getItemSize(index, rect.width);
    },
    [getItemSize, boxRectRef]
  );

  const getMeasuredItem = React.useCallback(
    (index: number): MeasuredItem => {
      const { current: measuredItems } = measuredItemsRef;
      const size = getItemSizeInternal(index);
      const start = measuredItems[index - 1]?.end ?? 0;
      return {
        index: index,
        start: start,
        size: size,
        end: start + size,
      };
    },
    [getItemSizeInternal]
  );

  const measureItems = React.useCallback(() => {
    const { current: measuredItems } = measuredItemsRef;
    measuredItems.length = itemCount;

    let totalSize = 0;

    for (let i = 0; i < itemCount; i++) {
      measuredItems[i] = getMeasuredItem(i);
      totalSize += measuredItems[i].size;
    }

    totalSizeRef.current = totalSize;
  }, [getMeasuredItem, itemCount]);

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

  const scrollToIndex = React.useCallback((index: number) => {}, []);

  const handleScroll = React.useCallback(
    (scrollOffset: number) => {
      const { current: measuredItems } = measuredItemsRef;
      const { current: boxRect } = boxRectRef;
      const lastIndex = itemCount - 1;
      let startIndex = 0;

      startIndex = binarySearch({
        low: 0,
        high: lastIndex,
        compare: (index: number) => {
          const value = measuredItems[index].start;
          if (value < scrollOffset) {
            return -1;
          } else if (value > scrollOffset) {
            return 1;
          }
          return 0;
        },
      });

      let endIndex = startIndex;
      const viewportOffset = scrollOffset + boxRect[sizeKey] * BUFFER_FACTOR;

      endIndex = exponentialSearch({
        index: startIndex,
        high: lastIndex,
        compare: (index: number) => {
          const value = measuredItems[index].end;
          if (value < viewportOffset) {
            return -1;
          } else if (value > viewportOffset) {
            return 1;
          }
          return 0;
        },
      });

      const items: MeasuredItem[] = [];
      for (let i = startIndex; i <= endIndex; i++) {
        items.push(measuredItems[i]);
      }

      const totalSize = totalSizeRef.current;
      const margin = items[0]?.start ?? 0;

      setState((prevState) =>
        shouldUpdate(prevState.items, items, {})
          ? {
              items: items,
              contentSize: totalSize - margin,
              contentMargin: margin,
            }
          : prevState
      );
    },
    [itemCount]
  );

  useEnhancedEffect(() => {
    const { current: box } = boxRef;

    if (!box) {
      return () => null;
    }

    const scrollHandler = ({ target }: Event) => {
      const scrollOffset = (target as HTMLElement)[scrollKey];

      if (scrollOffset === scrollOffsetRef.current) {
        return;
      }

      scrollOffsetRef.current = scrollOffset;
      handleScroll(scrollOffset);
    };
    box.addEventListener('scroll', scrollHandler, { passive: true });

    return () => {
      box.removeEventListener('scroll', scrollHandler);
    };
  }, [handleScroll]);

  useEnhancedEffect(() => {
    if (contentRef.current) {
      contentRef.current.style[sizeKey] = `${state.contentSize}px`;
      contentRef.current.style[marginKey] = `${state.contentMargin}px`;
    }
  }, [contentRef, state.contentSize, state.contentMargin]);

  useResizeEffect(
    boxRef,
    (rect: Rect) => {
      boxRectRef.current = rect;
      measureItems();
      handleScroll(scrollOffsetRef.current);
    },
    [scrollOffsetRef]
  );

  return {
    boxRef,
    contentRef,
    items: state.items,
    scrollToOffset,
    scrollToIndex,
  };
}

export interface VirtualizedListProps {}

export default function VirtualizedList() {
  const { items, boxRef, contentRef } = useVirtual<HTMLDivElement>({
    itemCount: 1000,
    getItemSize: () => 50,
  });

  return (
    <div
      style={{ height: '500px', width: '300px', overflow: 'auto' }}
      ref={boxRef}
    >
      <div ref={contentRef}>
        {items.map((_) => {
          return (
            <div
              key={_.index}
              style={{
                height: '50px',
                textAlign: 'center',
                lineHeight: '50px',
                backgroundColor: `${_.index % 2 ? 'lightgray' : ''}`,
              }}
            >
              {_.index}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import styled from 'styled-components';
import useEnhancedEffect from '../hooks/useEnhancedEffect';
import useResizeEffect, { Rect } from '../hooks/useResizeEffect';

interface State {
  items: MeasuredItem[];
  contentSize: number;
  contentMargin: number;
}

export interface VirtualizedListOptions {
  itemCount: number;
  getItemSize: (index: number, width: number) => number;
  overscanCount?: number;
  horizontal?: boolean;
}

interface MeasuredItem {
  index: number;
  size: number;
  start: number;
  end: number;
}

interface ScrollToOptions extends ScrollOptions {
  offset: number;
}

interface ScrollToIndexOptions extends ScrollOptions {
  index: number;
}

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
  let next = index;
  while (next < high && compare(next) < 0) {
    index = next;
    next += interval;
    interval *= 2;
  }

  return binarySearch({
    low: index,
    high: Math.min(next, high),
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

export function useVirtual<
  B extends HTMLElement = HTMLElement,
  C extends HTMLElement = B
>(options: VirtualizedListOptions) {
  const {
    itemCount,
    getItemSize,
    overscanCount = 5,
    horizontal = false,
  } = options;

  const [state, setState] = React.useState<State>({
    items: [],
    contentSize: 0,
    contentMargin: 0,
  });

  const scrollToKey = !horizontal ? 'top' : 'left';
  const scrollKey = !horizontal ? 'scrollTop' : 'scrollLeft';
  const sizeKey = !horizontal ? 'height' : 'width';
  const marginKey = !horizontal ? 'marginTop' : 'marginLeft';
  const boxRef = React.useRef<B>(null);
  const contentRef = React.useRef<C>(null);
  const measuredItemsRef = React.useRef<MeasuredItem[]>([]);
  const boxRectRef = React.useRef<Rect>({
    width: 0,
    height: 0,
  });
  const scrollOffsetRef = React.useRef(0); // not in use!
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

  const handleScroll = React.useCallback(
    (scrollOffset: number) => {
      scrollOffsetRef.current = scrollOffset;

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
      const viewportOffset = scrollOffset + boxRect[sizeKey];

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

      startIndex = Math.max(0, startIndex - overscanCount);
      endIndex = Math.min(lastIndex, endIndex + overscanCount);

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
    [itemCount, overscanCount, sizeKey]
  );

  const scrollTo = React.useCallback(
    ({ offset, behavior }: ScrollToOptions) => {
      if (boxRef.current) {
        handleScroll(offset);
        const scroll = () => {
          boxRef.current?.scrollTo({
            [scrollToKey]: offset,
            behavior: behavior,
          });
        };
        if (state.contentSize === 0) {
          requestAnimationFrame(() => {
            scroll();
          });
        } else {
          scroll();
        }
      }
    },
    [scrollToKey, handleScroll, state.contentSize]
  );

  const scrollToOffset = React.useCallback(
    (options: ScrollToOptions) => {
      scrollTo(options);
    },
    [scrollTo]
  );

  const scrollToIndex = React.useCallback(
    ({ index, behavior }: ScrollToIndexOptions) => {
      const { current: measuredItems } = measuredItemsRef;
      measureItems();
      const measureItem = measuredItems[index];
      if (measureItem) {
        const offset = measureItem.start;
        scrollTo({
          offset: offset,
          behavior,
        });
      }
    },
    [scrollTo, measureItems]
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
  }, [state.contentSize, state.contentMargin]);

  useResizeEffect(
    boxRef,
    (rect: Rect) => {
      boxRectRef.current = rect;
      measureItems();
      handleScroll(scrollOffsetRef.current);
    },
    []
  );

  return {
    boxRef,
    contentRef,
    items: state.items,
    scrollToOffset,
    scrollToIndex,
  };
}

export interface VirtualizedListProps extends VirtualizedListOptions {
  height: string;
  width: string;
  renderItem: (item: MeasuredItem) => React.ReactNode;
}

export type VirtualizedListHandle = {
  scrollToOffset: (options: ScrollToOptions) => void;
  scrollToIndex: ({ index, behavior }: ScrollToIndexOptions) => void;
};

export default React.forwardRef<VirtualizedListHandle, VirtualizedListProps>(
  function VirtualizedList(props, ref) {
    const { height, width, renderItem, ...options } = props;
    const { items, boxRef, contentRef, scrollToIndex, scrollToOffset } =
      useVirtual<HTMLDivElement>(options);

    React.useImperativeHandle(ref, () => ({
      scrollToIndex,
      scrollToOffset,
    }));

    const contentStyle: React.CSSProperties = {};
    if (options.horizontal) {
      contentStyle.display = 'flex';
    }

    return (
      <div
        style={{ height: height, width: width, overflow: 'auto' }}
        ref={boxRef}
      >
        <div style={contentStyle} ref={contentRef}>
          {items.map((_) => {
            return renderItem(_);
          })}
        </div>
      </div>
    );
  }
);

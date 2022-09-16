import React from 'react';
import useEnhancedEffect from 'src/hooks/useEnhancedEffect';
import useLatest from 'src/hooks/useLatest';
import useResizeEffect, { Rect } from 'src/hooks/useResizeEffect';

interface UseVirtualOptions {
  itemCount: number;
  getItemSize: (index: number, width: number) => number;
}

interface MeasuredItem {
  index: number;
  start: number;
  end: number;
}

function binarySearch({
  minIndex,
  maxIndex,
  compare,
}: {
  minIndex: number;
  maxIndex: number;
  compare: (mid: number) => boolean;
}) {
  while (maxIndex >= minIndex) {
    const middle = minIndex + Math.floor((maxIndex - minIndex) / 2);
    if (compare(middle)) {
      minIndex = middle + 1;
    } else {
      maxIndex = middle - 1;
    }
  }
  if (minIndex > 0) {
    return minIndex - 1;
  }
  //not found :)
  return 0;
}

function exponentialSearch({
  arrayLength,
  index,
  compare,
}: {
  arrayLength: number;
  index: number;
  compare: (index: number) => boolean;
}) {
  let interval = 1;
  while (index < arrayLength && compare(index)) {
    index += interval;
    interval *= 2;
  }
  return binarySearch({
    minIndex: Math.min(index, arrayLength - 1),
    maxIndex: Math.floor(index / 2),
    compare,
  });
}

function useVirtual<
  B extends HTMLElement = HTMLElement,
  C extends HTMLElement = B
>(options: UseVirtualOptions) {
  const { itemCount, getItemSize } = options;

  const [items, setItems] = React.useState([]);
  const scrollKey = 'scrollTop';
  const boxRef = React.useRef<B>(null);
  const contentRef = React.useRef<C>(null);
  const measuredItemsRef = React.useRef<MeasuredItem[]>([]);
  const boxRectRef = React.useRef<Rect>({
    width: 0,
    height: 0,
  });
  const scrollOffsetRef = React.useRef(0);

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
      const start = (measuredItems[index - 1]?.end ?? 0) + size;
      return {
        index: index,
        start: start,
        end: start + size,
      };
    },
    [getItemSizeInternal]
  );

  const getLastMeasuredItem = (): MeasuredItem => {
    const { current: measuredItems } = measuredItemsRef;
    return (
      measuredItems.slice(-1).pop() ?? {
        index: 0,
        start: 0,
        end: 0,
      }
    );
  };

  const calculateItems = React.useCallback(
    (index: number) => {
      const { current: measuredItems } = measuredItemsRef;
      const last = getLastMeasuredItem();

      for (let i = last.index; i < index; i++) {
        measuredItems[i] = getMeasuredItem(index);
      }

      return getLastMeasuredItem();
    },
    [getMeasuredItem]
  );

  const measureItems = React.useCallback(() => {
    const { current: scrollOffset } = scrollOffsetRef;
    const { current: measuredItems } = measuredItemsRef;
    const { current: boxRect } = boxRectRef;
    const last = getLastMeasuredItem();
    let lastEnd = last.end;
    let startIndex = last.index;

    const compare = (index: number) =>
      calculateItems(index).start < scrollOffset;

    if (lastEnd < scrollOffset) {
      startIndex = binarySearch({
        minIndex: 0,
        maxIndex: itemCount,
        compare: compare,
      });
    } else {
      startIndex = exponentialSearch({
        arrayLength: itemCount,
        index: 0,
        compare: compare,
      });
    }

    let endIndex = startIndex;
    const viewportOffset = scrollOffset + boxRect.height; // TODO: USE RECT KEY
    while (measuredItems[endIndex].end < viewportOffset) {
      endIndex++;
      calculateItems(endIndex);
    }
  }, [calculateItems, itemCount]);

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

  const handleScroll = React.useCallback((scrollOffset: number) => {
    // calculate shown items by offset
  }, []);

  useEnhancedEffect(() => {
    const { current: box } = boxRef;
    if (!box) {
      return () => null;
    }

    const scrollHandler = ({ target }: Event) => {
      const scrollOffset = (target as HTMLElement)[scrollKey];

      scrollOffsetRef.current = scrollOffset;

      measureItems();
      handleScroll(scrollOffset);
    };
    box.addEventListener('scroll', scrollHandler, { passive: true });

    return () => {
      box.removeEventListener('scroll', scrollHandler);
    };
  }, [handleScroll, measureItems]);

  useResizeEffect(
    boxRef,
    (rect: Rect) => {
      boxRectRef.current = rect;
    },
    []
  );

  return {
    boxRef,
    contentRef,
    scrollToOffset,
    scrollToIndex,
  };
}

export interface VirtualizedListProps {}

export default function VirtualizedList() {
  const items = React.useMemo(() => Array<number>(1000).fill(0), []);
  const { boxRef, contentRef } = useVirtual<HTMLDivElement>({
    itemCount: 1000,
    getItemSize: () => 100,
  });

  return (
    <div ref={boxRef}>
      <div ref={contentRef}>
        {items.map((_, index) => {
          return <div>{index}</div>;
        })}
      </div>
    </div>
  );
}

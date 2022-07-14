import React from 'react';
import { Transition } from 'react-transition-group';
import useForkRef from '../hooks/useForkRef';
import {
  createTransition,
  getTransitionProps,
  reflow,
} from '../utils/transition';
import {
  SharedHostContext,
  SharedHostContextValue,
  useSharedHostContext,
} from './useSharedHost';
import isClient from '../utils/isClient';

export const SharedHost = ({ children }: React.PropsWithChildren<any>) => {
  const rectMapRef = React.useRef(new Map<string, DOMRect | undefined>());

  const getRect = React.useCallback((port: string) => {
    return rectMapRef.current.get(port);
  }, []);

  const setRect = React.useCallback(
    (port: string, rect: DOMRect | undefined) => {
      rectMapRef.current.set(port, rect);
    },
    []
  );

  const contextValue: SharedHostContextValue = {
    getRect,
    setRect,
  };

  return (
    <SharedHostContext.Provider value={contextValue}>
      {children}
    </SharedHostContext.Provider>
  );
};

const defaultEasing = {
  enter: 'ease-out',
  exit: 'sharp',
};

const defaultTimeout = {
  enter: 300,
  exit: 0,
};

const getTranslateValue = function (
  currentRect: DOMRect,
  prevRect: DOMRect | undefined
) {
  if (prevRect) {
    const x = prevRect.left - currentRect.left;
    const y = prevRect.top - currentRect.top;

    return `translate(${x}px, ${y}px)`;
  }

  return undefined;
};

const useBoundingClientRect = function (
  nodeRef: React.MutableRefObject<HTMLElement | undefined>
) {
  const rectRef = React.useRef<DOMRect>({
    left: 0,
    top: 0,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  } as DOMRect);

  const update = React.useCallback(() => {
    if (isClient && nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      rectRef.current = rect;
    }
  }, [nodeRef]);

  return {
    get value() {
      return rectRef.current;
    },
    update,
  };
};

export interface SharedElementProps {
  port: string;
  children: React.ReactElement;
  style?: React.CSSProperties;
}

const SharedElement = React.forwardRef<HTMLElement, SharedElementProps>(
  function SharedElement(props, ref?) {
    const { children, port, style } = props;

    const context = useSharedHostContext(port);

    const nodeRef = React.useRef<HTMLElement | undefined>(undefined);
    const handleRefIntermediary = useForkRef((children as any)?.ref, ref);
    const handleRef = useForkRef(nodeRef, handleRefIntermediary);

    const nodeRect = useBoundingClientRect(nodeRef);

    const normalizedTransitionCallback =
      (callback: (node: HTMLElement, isAppearing?: boolean) => void) =>
      (isAppearing?: boolean) => {
        if (callback) {
          if (isAppearing === undefined) {
            callback(nodeRef.current!);
          } else {
            callback(nodeRef.current!, isAppearing);
          }
        }
      };

    const handleEnter = normalizedTransitionCallback(
      (node, isAppearing?: boolean) => {
        nodeRect.update(); // computed bounding client rect

        const prevRect = context.getRect();
        context.setRect(nodeRect.value);
        const transform = getTranslateValue(nodeRect.value, prevRect);

        if (transform) {
          node.style.transform = transform;
          reflow(node); // !!!!!! set style in the same time will update in batches (handleEntering followed)
        }
      }
    );

    const handleEntering = normalizedTransitionCallback(
      (node, isAppearing?: boolean) => {
        const transitionProps = getTransitionProps(
          { timeout: defaultTimeout, style, easing: defaultEasing },
          {
            mode: 'enter',
          }
        );

        node.style.transition = createTransition('transform', transitionProps);
        node.style.webkitTransform = 'none';
        node.style.transform = 'none';
      }
    );

    return (
      <Transition
        in
        appear
        nodeRef={nodeRef}
        timeout={defaultTimeout}
        onEnter={handleEnter}
        onEntering={handleEntering}
      >
        {(state) => {
          return React.cloneElement(children as any, {
            ref: handleRef,
          });
        }}
      </Transition>
    );
  }
);

export default SharedElement;

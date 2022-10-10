import React from 'react';
import { Transition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';
import ownerDocument from '../utils/ownerDocument';
import ownerWindow from '../utils/ownerWindow';
import {
  createTransition,
  getTransitionProps,
  normalizedTransitionCallback,
  reflow,
} from '../utils/transition';
import debounce from '../utils/debounce';
import useForkRef from '../hooks/useForkRef';
import { resolveValue } from '../utils';

export type DirectionType = 'left' | 'right' | 'up' | 'down';
export type SlideProps = TransitionProps & {
  children: React.ReactElement;
  container?: HTMLElement | (() => HTMLElement);
  direction?: DirectionType;
  easing?: EasingProp;
};

const defaultEasing: EasingProp = {
  enter: 'ease-out',
  exit: 'sharp',
};

const defaultTimeout = {
  enter: 225,
  exit: 195,
};

function getTranslateValue(
  direction: DirectionType,
  node: HTMLElement,
  resolvedContainer: Element
) {
  const rect = node.getBoundingClientRect();
  const containerRect =
    resolvedContainer && resolvedContainer.getBoundingClientRect();
  const containerWindow = ownerWindow(node);
  let transform;

  const computedStyle = containerWindow.getComputedStyle(node);
  transform =
    computedStyle.getPropertyValue('-webkit-transform') ||
    computedStyle.getPropertyValue('transform');

  let offsetX = 0;
  let offsetY = 0;

  if (transform && transform !== 'none' && typeof transform === 'string') {
    const transformValues = transform.split('(')[1].split(')')[0].split(',');
    offsetX = parseInt(transformValues[4], 10);
    offsetY = parseInt(transformValues[5], 10);
  }

  if (direction === 'left') {
    if (containerRect) {
      return `translateX(${containerRect.right + offsetX - rect.left}px)`;
    }

    return `translateX(${containerWindow.innerWidth + offsetX - rect.left}px)`;
  }

  if (direction === 'right') {
    if (containerRect) {
      return `translateX(-${rect.right - containerRect.left - offsetX}px)`;
    }

    return `translateX(-${rect.left + rect.width - offsetX}px)`;
  }

  if (direction === 'up') {
    if (containerRect) {
      return `translateY(${containerRect.bottom + offsetY - rect.top}px)`;
    }
    return `translateY(${containerWindow.innerHeight + offsetY - rect.top}px)`;
  }

  // direction === 'down'
  if (containerRect) {
    return `translateY(-${
      rect.top - containerRect.top + rect.height - offsetY
    }px)`;
  }
  return `translateY(-${rect.top + rect.height - offsetY}px)`;
}

export function setTranslateValue(
  direction: DirectionType,
  node: HTMLElement,
  containerProp: Element | (() => Element) | undefined
) {
  const resolvedContainer = containerProp
    ? resolveValue(containerProp)
    : ownerDocument(node).body;

  const transform = getTranslateValue(direction, node, resolvedContainer);

  if (transform) {
    node.style.webkitTransform = transform;
    node.style.transform = transform;
  }
}

const Slide = React.forwardRef<HTMLElement, SlideProps>(function Slide(
  props,
  ref?
) {
  const {
    style,
    in: inProp,
    direction = 'down',
    timeout = defaultTimeout,
    children,
    easing: easingProp = defaultEasing,
    container: containerProp,
    onEnter,
    onEntering,
    onExit,
    onExited,
    ...other
  } = props;

  const nodeRef = React.useRef<HTMLElement | null>(null);
  const foreignRef = useForkRef((children as any).ref, ref);
  const handleRef = useForkRef(nodeRef, foreignRef);

  const handleEnter = normalizedTransitionCallback(
    nodeRef,
    (node, isAppearing: boolean) => {
      setTranslateValue(direction, node, containerProp);
      reflow(node);

      if (onEnter) {
        onEnter(node, isAppearing);
      }
    }
  );

  const handleEntering = normalizedTransitionCallback(
    nodeRef,
    (node, isAppearing: boolean) => {
      const transitionProps = getTransitionProps(
        { timeout, style, easing: easingProp },
        {
          mode: 'enter',
        }
      );

      node.style.transition = createTransition('transform', transitionProps);
      node.style.webkitTransform = 'none';
      node.style.transform = 'none';

      if (onEntering) {
        onEntering(node, isAppearing);
      }
    }
  );

  const handleExit = normalizedTransitionCallback(
    nodeRef,
    (node, isAppearing) => {
      const transitionProps = getTransitionProps(
        { timeout, style, easing: easingProp },
        {
          mode: 'exit',
        }
      );

      node.style.transition = createTransition('transform', transitionProps);

      setTranslateValue(direction, node, containerProp);

      if (onExit) {
        onExit(node);
      }
    }
  );

  const handleExited = normalizedTransitionCallback(nodeRef, (node) => {
    node.style.webkitTransition = '';
    node.style.transition = '';

    if (onExited) {
      onExited(node);
    }
  });

  const updatePosition = React.useCallback(() => {
    if (nodeRef.current) {
      setTranslateValue(direction, nodeRef.current, containerProp);
    }
  }, [direction, containerProp]);

  React.useEffect(() => {
    if (inProp || direction === 'down' || direction === 'right') {
      return undefined;
    }

    const handleResize = debounce(() => {
      if (nodeRef.current) {
        setTranslateValue(direction, nodeRef.current, containerProp);
      }
    });

    const containerWindow = ownerWindow(nodeRef.current);
    containerWindow.addEventListener('resize', handleResize);
    return () => {
      handleResize.clear();
      containerWindow.removeEventListener('resize', handleResize);
    };
  }, [direction, inProp, containerProp]);

  React.useEffect(() => {
    if (!inProp) {
      updatePosition();
    }
  }, [inProp, updatePosition]);

  return (
    <Transition
      in={inProp}
      nodeRef={nodeRef}
      timeout={timeout}
      onEnter={handleEnter}
      onEntering={handleEntering}
      onExit={handleExit}
      onExited={handleExited}
      {...(other as TransitionProps<HTMLElement>)}
    >
      {(state) => {
        return React.cloneElement(children, {
          style: {
            visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
            ...style,
            ...children.props.style,
          },
          ref: handleRef,
          ...children.props,
        });
      }}
    </Transition>
  );
});

export default Slide;

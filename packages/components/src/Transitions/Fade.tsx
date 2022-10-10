import React from 'react';
import { Transition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';
import useForkRef from '../hooks/useForkRef';
import {
  createTransition,
  getTransitionProps,
  normalizedTransitionCallback,
  reflow,
} from '../utils/transition';

export type FadeProps = TransitionProps & {
  children: React.ReactElement;
  easing?: EasingProp;
};

const styles = {
  entering: {
    opacity: 1,
  },
  entered: {
    opacity: 1,
  },
};

const defaultTimeout = {
  enter: 225,
  exit: 195,
};

const defaultEasing: EasingProp = {
  enter: 'ease-out',
  exit: 'sharp',
};

const Fade = React.forwardRef<HTMLElement, FadeProps>(function Fade(
  props,
  ref?
) {
  const {
    style,
    in: inProp,
    timeout = defaultTimeout,
    easing: easingProp = defaultEasing,
    children,
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
      reflow(node);

      const transitionProps = getTransitionProps(
        { style, timeout, easing: easingProp },
        {
          mode: 'enter',
        }
      );

      node.style.webkitTransition = createTransition(
        'opacity',
        transitionProps
      );
      node.style.transition = createTransition('opacity', transitionProps);

      if (onEnter) {
        onEnter(node, isAppearing);
      }
    }
  );

  const handleEntering = normalizedTransitionCallback(nodeRef, onEntering);

  const handleExit = normalizedTransitionCallback(nodeRef, (node) => {
    const transitionProps = getTransitionProps(
      { timeout, style, easing: easingProp },
      {
        mode: 'exit',
      }
    );

    node.style.webkitTransition = createTransition('opacity', transitionProps);
    node.style.transition = createTransition('opacity', transitionProps);

    if (onExit) {
      onExit(node);
    }
  });

  const handleExited = normalizedTransitionCallback(nodeRef, onExited);

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
            opacity: 0,
            // @ts-ignore
            ...styles[state],
            ...children.props.style,
          },
          ref: handleRef,
          ...children.props,
        });
      }}
    </Transition>
  );
});

export default Fade;

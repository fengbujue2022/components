import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import clsx from 'clsx';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TimeoutProps } from 'react-transition-group/Transition';
import { generateUtilityClasses } from '../utils/generateUtilityClasses';

const DURATION = 550;
const enterKeyframe = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`;

const exitKeyframe = keyframes`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`;

type RippleProps = {
  rippleY: number;
  rippleX: number;
  rippleSize: number;
  className?: string;
} & TimeoutProps<HTMLSpanElement>;

// Transaction group props will be injected by TransitionGroup(https://github1s.com/reactjs/react-transition-group/blob/HEAD/src/utils/ChildMapping.js)
export const Ripple = (props: RippleProps) => {
  const {
    className,
    in: inProp,
    onExited,
    rippleSize,
    rippleX,
    rippleY,
    timeout,
  } = props;

  const [leaving, setLeaving] = React.useState(false);
  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX,
  };

  if (!inProp && !leaving) {
    setLeaving(true);
  }

  React.useEffect(() => {
    if (!inProp && onExited != null) {
      const timeoutId = setTimeout(onExited, timeout as number);
      return () => {
        clearTimeout(timeoutId);
      };
    }
    return undefined;
  }, [onExited, inProp, timeout]);

  const rippleClassName = clsx(className, rippleClasses.rippleVisible);
  const childClassName = clsx(rippleClasses.child, {
    [rippleClasses.childLeaving]: leaving,
  });

  return (
    <span className={rippleClassName} style={rippleStyles}>
      <span className={childClassName}></span>
    </span>
  );
};

const rippleClasses = generateUtilityClasses('Ripple', [
  'rippleVisible',
  'child',
  'childLeaving',
]);

const StyledRipple = styled(Ripple)`
  opacity: 0;
  position: absolute;
  background-color: #42a5f5;
  border-radius: 50%;

  &.${rippleClasses.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
    animation: ${enterKeyframe} ${DURATION}ms ease-out;
  }

  & .${rippleClasses.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${rippleClasses.childLeaving} {
    opacity: 0;
    animation: ${exitKeyframe} ${DURATION}ms ease-out;
  }
`;

const StyledRippleRoot = styled.span`
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: inherit;
`;

export type TouchRippleHandle = {
  start: (event: any) => void;
  stop: () => void;
};

const TouchRipple = React.forwardRef<TouchRippleHandle, RippleProps>(
  function TouchRipple(props, ref?) {
    const [ripples, setRipples] = useState<React.ReactElement[]>([]);
    const nextKey = React.useRef(0);
    const container = React.useRef<HTMLSpanElement>(null);

    const startCommit = React.useCallback(
      (params: { rippleX: number; rippleY: number; rippleSize: number }) => {
        const { rippleSize, rippleX, rippleY } = params;
        setRipples((oldRipples) => [
          ...oldRipples,
          <StyledRipple
            key={nextKey.current}
            timeout={DURATION}
            rippleX={rippleX}
            rippleY={rippleY}
            rippleSize={rippleSize}
          />,
        ]);
        nextKey.current += 1;
      },
      []
    );

    const start = React.useCallback(
      (event: any) => {
        const element = container.current;

        const rect = element
          ? element.getBoundingClientRect()
          : {
              width: 0,
              height: 0,
              left: 0,
              top: 0,
            };
        // Get the size of the ripple
        let rippleX: number;
        let rippleY: number;
        let rippleSize: number;

        if (
          (event.clientX === 0 && event.clientY === 0) ||
          (!event.clientX && !event.touches)
        ) {
          rippleX = Math.round(rect.width / 2);
          rippleY = Math.round(rect.height / 2);
        } else {
          const { clientX, clientY } = event.touches ? event.touches[0] : event;
          rippleX = Math.round(clientX - rect.left);
          rippleY = Math.round(clientY - rect.top);
        }

        const sizeX =
          Math.max(
            Math.abs((element ? element.clientWidth : 0) - rippleX),
            rippleX
          ) *
            2 +
          2;
        const sizeY =
          Math.max(
            Math.abs((element ? element.clientHeight : 0) - rippleY),
            rippleY
          ) *
            2 +
          2;
        rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);
        rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);
        startCommit({ rippleX, rippleY, rippleSize });
      },
      [startCommit]
    );
    const stop = React.useCallback(() => {
      setRipples((oldRipples) => {
        if (oldRipples.length > 0) {
          return oldRipples.slice(1);
        }
        return oldRipples;
      });
    }, []);

    React.useImperativeHandle(
      ref,
      () => ({
        start,
        stop,
      }),
      [start, stop]
    );

    return (
      <StyledRippleRoot ref={container}>
        <TransitionGroup component={null} exit>
          {ripples}
        </TransitionGroup>
      </StyledRippleRoot>
    );
  }
);

export default TouchRipple;

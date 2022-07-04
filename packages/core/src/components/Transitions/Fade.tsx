import React from 'react';
import { Transition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';
import useForkRef from '@components/core/src/hooks/useForkRef';

export type FadeProps = TransitionProps<HTMLElement | undefined> & {
  children?: any;
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

const Fade = React.forwardRef<any, FadeProps>(function Fade(props, ref?) {
  const {
    style,
    in: inProp,
    timeout = defaultTimeout,
    children,
    ...other
  } = props;
  const nodeRef = React.useRef(null);
  const foreignRef = useForkRef((children as any).ref, ref);
  const handleRef = useForkRef(nodeRef, foreignRef);

  return (
    <Transition in={inProp} nodeRef={nodeRef} timeout={timeout} {...other}>
      {(state) => {
        return React.cloneElement(children as any, {
          style: {
            opacity: 0,
            visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
            // @ts-ignore
            ...styles[state],
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

export default Fade;

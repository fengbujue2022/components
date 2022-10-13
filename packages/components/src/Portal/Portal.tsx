import React from 'react';
import * as ReactDOM from 'react-dom';
import setRef from '../utils/setRef';
import useForkRef from '../hooks/useForkRef';
import useEnhancedEffect from '../hooks/useEnhancedEffect';
import { resolveValue } from '../utils';
import { forwardRef } from '../system';

type PortalProps = {
  container?: HTMLElement | (() => HTMLElement);
  disablePortal?: boolean;
  children: React.ReactElement;
};

export default forwardRef<PortalProps, any>(function Portal(props, ref) {
  const { children, container, disablePortal = false } = props;
  const [mountNode, setMountNode] = React.useState<Element | null>(null);
  const handleRef = useForkRef(
    React.isValidElement(children) ? (children as any).ref : null,
    ref
  );

  useEnhancedEffect(() => {
    if (!disablePortal) {
      setMountNode(container ? resolveValue(container) : document.body);
    }
  }, [container, disablePortal]);

  useEnhancedEffect(() => {
    if (mountNode && !disablePortal) {
      setRef(ref, mountNode);
      return () => {
        setRef(ref, null);
      };
    }
    return undefined;
  }, [ref, mountNode, disablePortal]);

  if (disablePortal) {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref: handleRef,
      });
    }
    return children;
  }

  return (
    mountNode ? ReactDOM.createPortal(children, mountNode) : mountNode
  ) as any;
});

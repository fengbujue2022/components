import React from 'react';
import * as ReactDOM from 'react-dom';
import setRef from '../../utils/setRef';
import useForkRef from '@components/core/src/hooks/useForkRef';
import useEnhancedEffect from '@components/core/src/hooks/useEnhancedEffect';

type PortalProps = {
  container: Element | (() => Element);
  disablePortal?: boolean;
};

const resolveContainer = (container: Element | (() => Element)) => {
  return typeof container === 'function' ? container() : container;
};

export default React.forwardRef<Element, React.PropsWithChildren<PortalProps>>(
  function Portal(props, ref) {
    const { children, container, disablePortal = false } = props;
    const [mountNode, setMountNode] = React.useState<Element | null>(null);
    const handleRef = useForkRef(
      React.isValidElement(children) ? (children as any).ref : null,
      ref
    );

    useEnhancedEffect(() => {
      if (!disablePortal) {
        setMountNode(resolveContainer(container) || document.body);
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
  }
);

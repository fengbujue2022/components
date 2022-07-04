import React from 'react';
import { PortalContext } from './PortalContext';

const PortalHostProvider: React.FC = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const container = React.useRef<HTMLDivElement>(null);

  return (
    <PortalContext.Provider
      value={{
        containerRef: container,
      }}
    >
      <div ref={container}>{children}</div>
    </PortalContext.Provider>
  );
};

export default PortalHostProvider;

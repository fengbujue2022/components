import React from 'react';

type PortalState = { containerRef?: React.RefObject<Element> };

const PortalContext = React.createContext<PortalState | null>(null);

function usePortalHostState() {
  const context = React.useContext(PortalContext);
  if (context === undefined) {
    throw new Error(
      'usePortalHostState must be used within a PortalHostProvider'
    );
  }
  return context;
}

export { PortalContext, usePortalHostState };

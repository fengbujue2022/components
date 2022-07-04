import React from 'react';

export interface SharedHostContextValue {
  getRect: (port: string) => DOMRect | undefined;
  setRect: (port: string, rect: DOMRect | undefined) => void;
}

export const SharedHostContext = React.createContext<
  SharedHostContextValue | undefined
>(undefined);

export const useSharedHostContext = function (port: string) {
  const context = React.useContext(SharedHostContext);

  const getRect = React.useCallback(() => {
    return context?.getRect(port);
  }, [port, context]);

  const setRect = React.useCallback(
    (rect: DOMRect | undefined) => {
      return context?.setRect(port, rect);
    },
    [port, context]
  );

  return {
    getRect,
    setRect,
  };
};

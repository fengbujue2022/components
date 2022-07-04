import React, { useCallback, useRef, useState } from 'react';
import styled, { StyledComponentProps } from 'styled-components';
import TouchRipple, { TouchRippleHandle } from './TouchRipple';

export interface ButtonBaseProps
  extends StyledComponentProps<'button', any, {}, never> {
  disableRipple?: boolean;
  component?: React.ElementType;
}

const ButtonBaseRoot = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  boxSizing: 'border-box',
  WebkitTapHighlightColor: 'transparent',
  backgroundColor: 'transparent', // Reset default value
  // We disable the focus ring for mouse, touch and keyboard users.
  outline: 0,
  border: 0,
  margin: 0, // Remove the margin in Safari
  borderRadius: 0,
  padding: 0, // Remove the padding in Firefox
  cursor: 'pointer',
  userSelect: 'none',
  verticalAlign: 'middle',
  MozAppearance: 'none', // Reset
  WebkitAppearance: 'none', // Reset
  textDecoration: 'none',
  // So we take precedent over the style of a native <a /> element.
  color: 'inherit',
  '&::-moz-focus-inner': {
    borderStyle: 'none', // Remove Firefox dotted outline.
  },
});

const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  function ButtonBase(props, ref?) {
    const {
      children,
      component = 'button',
      disableRipple = false,
      onDragLeave,
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onTouchEnd,
      onTouchStart,
      ...other
    } = props;
    const rippleRef = useRef<TouchRippleHandle>(null);

    function useRippleHandler<E extends React.SyntheticEvent<any>>(
      rippleAction: keyof TouchRippleHandle,
      eventCallback?: React.EventHandler<E>
    ): React.EventHandler<E> {
      return useCallback((event: E) => {
        if (rippleRef.current) {
          rippleRef.current[rippleAction](event);
        }
        if (eventCallback) {
          eventCallback(event);
        }
      }, []);
    }

    const handleMouseDown = useRippleHandler('start', onMouseDown);
    const handleMouseUp = useRippleHandler('stop', onMouseUp);
    const handleMouseLeave = useRippleHandler('stop', onMouseLeave);
    const handleDragLeave = useRippleHandler('stop', onDragLeave);
    // const handleTouchStart = useRippleHandler("start", onTouchStart);
    // const handleTouchEnd = useRippleHandler("stop", onTouchEnd);

    return (
      <ButtonBaseRoot
        as={component}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onDragLeave={handleDragLeave}
        // onTouchStart={handleTouchStart}
        // onTouchEnd={handleTouchEnd}
        {...other}
      >
        {!disableRipple ? <TouchRipple ref={rippleRef} /> : null}
        {children}
      </ButtonBaseRoot>
    );
  }
);

export default ButtonBase;

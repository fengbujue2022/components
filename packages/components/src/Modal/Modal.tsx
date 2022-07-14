import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import Backdrop, { BackdropProps } from '../Backdrop';
import Portal from '../Portal';

export type ModalCloseEventType = 'backdropClick' | 'escapeKeyDown';
export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose?: (
    event: React.SyntheticEvent<any>,
    type: ModalCloseEventType
  ) => void;
  onBackdropClick?: (event: React.SyntheticEvent<any>) => void;
  disablePortal?: boolean;
  container?: Element | (() => Element);
  hideBackdrop?: boolean;
  keepMounted?: boolean;
  backdropProps?: Partial<BackdropProps>;
}

const ModalRoot = styled.div<Pick<ModalProps, 'open'>>((props) => ({
  position: 'fixed',
  zIndex: 999, // TODO
  right: 0,
  bottom: 0,
  top: 0,
  left: 0,
  ...(!props.open && {
    visibility: 'hidden',
  }),
}));

const Modal = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ModalProps>
>(function Modal(props, ref?) {
  const {
    backdropProps,
    children,
    container,
    disablePortal = false,
    hideBackdrop = false,
    keepMounted = false,
    onBackdropClick,
    onClose,
    open,
    ...other
  } = props;

  if (!keepMounted && !open) {
    return null;
  }

  const handleBackdropClick = (event: React.MouseEvent<any>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (onBackdropClick) {
      onBackdropClick(event);
    }

    if (onClose) {
      onClose(event, 'backdropClick');
    }
  };

  return (
    <Portal disablePortal={disablePortal} container={container!}>
      <ModalRoot ref={ref} open={open} {...other}>
        {!hideBackdrop ? (
          <Backdrop
            onClick={handleBackdropClick}
            {...backdropProps}
            open={open}
          />
        ) : null}
        {children}
      </ModalRoot>
    </Portal>
  );
});

export default Modal;

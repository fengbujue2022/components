import React, { HTMLAttributes } from 'react';
import useEnhancedEffect from '../hooks/useEnhancedEffect';
import styled from 'styled-components';
import Backdrop, { BackdropProps } from '../Backdrop';
import Portal from '../Portal';
import {
  getScrollbarSize,
  ownerDocument,
  ownerWindow,
  resolveValue,
} from '../utils';

export type ModalCloseEventType = 'backdropClick' | 'escapeKeyDown';
export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose?: (
    event: React.SyntheticEvent<any>,
    type: ModalCloseEventType
  ) => void;
  onBackdropClick?: (event: React.SyntheticEvent<any>) => void;
  disablePortal?: boolean;
  container?: HTMLElement | (() => HTMLElement);
  hideBackdrop?: boolean;
  keepMounted?: boolean;
  backdropProps?: Partial<BackdropProps>;
}

const ModalRoot = styled.div<Pick<ModalProps, 'open'>>((props) => ({
  position: 'fixed',
  zIndex: 999, // TODO add modalManager
  right: 0,
  bottom: 0,
  top: 0,
  left: 0,
  ...(!props.open && {
    visibility: 'hidden',
  }),
}));

function isOverflowing(container: Element): boolean {
  const doc = ownerDocument(container);

  if (doc.body === container) {
    return ownerWindow(container).innerWidth > doc.documentElement.clientWidth;
  }

  return container.scrollHeight > container.clientHeight;
}

function getPaddingRight(element: Element): number {
  return (
    parseInt(ownerWindow(element).getComputedStyle(element).paddingRight, 10) ||
    0
  );
}

const Modal = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ModalProps>
>(function Modal(props, ref?) {
  const {
    backdropProps,
    children,
    container: containerProp,
    disablePortal = false,
    hideBackdrop = false,
    keepMounted = false,
    onBackdropClick,
    onClose,
    open,
    ...other
  } = props;

  const restoreStyleRef = React.useRef<
    Array<{
      value: string;
      property: string;
      el: HTMLElement;
    }>
  >([]);

  useEnhancedEffect(() => {
    const scrollContainer: HTMLElement = containerProp
      ? resolveValue(containerProp)
      : ownerDocument(containerProp).body;
    const { current: restoreStyle } = restoreStyleRef;

    if (open) {
      if (isOverflowing(scrollContainer)) {
        restoreStyle.push({
          value: scrollContainer.style.paddingRight,
          property: 'padding-right',
          el: scrollContainer,
        });

        const scrollbarSize = getScrollbarSize(ownerDocument(scrollContainer));

        scrollContainer.style.paddingRight = `${
          scrollbarSize + getPaddingRight(scrollContainer)
        }px`;
      }

      restoreStyle.push(
        {
          value: scrollContainer.style.overflow,
          property: 'overflow',
          el: scrollContainer,
        },
        {
          value: scrollContainer.style.overflowX,
          property: 'overflow-x',
          el: scrollContainer,
        },
        {
          value: scrollContainer.style.overflowY,
          property: 'overflow-y',
          el: scrollContainer,
        }
      );

      scrollContainer.style.overflow = 'hidden';
    } else {
      restoreStyle.forEach(({ value, el, property }) => {
        if (value) {
          el.style.setProperty(property, value);
        } else {
          el.style.removeProperty(property);
        }
      });
      restoreStyleRef.current = [];
    }
  }, [open]);

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

  if (!keepMounted && !open) {
    return null;
  }

  return (
    <Portal disablePortal={disablePortal} container={containerProp}>
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

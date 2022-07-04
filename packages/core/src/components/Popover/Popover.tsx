import React, { RefAttributes } from 'react';
import styled from 'styled-components';
import ownerDocument from '@components/core/src/utils/ownerDocument';
import debounce from '@components/core/src/utils/debounce';
import ownerWindow from '@components/core/src/utils/ownerWindow';
import Modal, { ModalProps } from '../Modal';
import { Fade } from '../Transitions';
import Paper from '../Paper';
import { TransitionProps } from '../types';

export type PopoverPosition = {
  top: number;
  left: number;
};

export interface PopoverProps extends ModalProps {
  open: boolean;
  onClose?: () => void;
  anchorEl?: Element | (() => Element);
  anchorOrigin?: {
    vertical: 'top' | 'bottom' | 'center';
    horizontal: 'left' | 'right' | 'center';
  };
  anchorPosition?: PopoverPosition;
  disablePortal?: boolean;
  TransitionComponent: React.JSXElementConstructor<TransitionProps>;
  transitionDuration?:
    | number
    | { appear?: number; enter?: number; exit?: number };
}

const PopoverRoot = styled(Modal)``;
const PopoverPaper = styled(Paper)`
  background-color: #fff;
  color: rgba(0, 0, 0, 0.87);
  -webkit-transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 4px;
  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2),
    0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
  position: absolute;
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 16px;
  min-height: 16px;
  max-width: calc(100% - 32px);
  max-height: calc(100% - 32px);
  outline: 0;
`;

export function getOffsetTop(
  rect: DOMRect,
  vertical: 'top' | 'bottom' | 'center' | number
) {
  let offset = 0;

  if (typeof vertical === 'number') {
    offset = vertical;
  } else if (vertical === 'center') {
    offset = rect.height / 2;
  } else if (vertical === 'bottom') {
    offset = rect.height;
  }

  return offset;
}

export function getOffsetLeft(
  rect: DOMRect,
  horizontal: 'left' | 'right' | 'center' | number
) {
  let offset = 0;

  if (typeof horizontal === 'number') {
    offset = horizontal;
  } else if (horizontal === 'center') {
    offset = rect.width / 2;
  } else if (horizontal === 'right') {
    offset = rect.width;
  }

  return offset;
}

const resolveAnchorEl = (anchorEl: Element | (() => Element) | undefined) => {
  return typeof anchorEl === 'function' ? anchorEl() : anchorEl;
};

const Popover = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<PopoverProps>
>(function Popover(props, ref?) {
  const {
    open,
    transitionDuration,
    anchorEl,
    anchorOrigin = {
      vertical: 'top',
      horizontal: 'left',
    },
    anchorPosition,
    disablePortal = false,
    TransitionComponent = Fade,
    children,
    style,
    ...other
  } = props;

  const paperRef = React.useRef<HTMLDivElement>(null);

  const getAnchorOffset = React.useCallback(
    function () {
      const resolvedAnchorEl = resolveAnchorEl(anchorEl);
      const anchorElement =
        resolvedAnchorEl && resolvedAnchorEl.nodeType === 1
          ? resolvedAnchorEl
          : ownerDocument(paperRef.current).body;

      const anchorRect = anchorElement.getBoundingClientRect();
      return {
        top: anchorRect.top + getOffsetTop(anchorRect, anchorOrigin.vertical),
        left:
          anchorRect.left + getOffsetLeft(anchorRect, anchorOrigin.horizontal),
      };
    },
    [anchorEl, anchorOrigin]
  );

  const getPositioningStyles = React.useCallback(
    function (element: HTMLDivElement) {
      const elemRect = {
        width: element.offsetWidth,
        height: element.offsetHeight,
      };
      const anchorOffset = getAnchorOffset();
      const bottom = anchorOffset.top + elemRect.height;
      const right = anchorOffset.left + elemRect.width;

      return {
        top: `${Math.round(anchorOffset.top)}px`,
        left: `${Math.round(anchorOffset.left)}px`,
      };
    },
    [getAnchorOffset]
  );

  const setPositioningStyles = React.useCallback(
    function () {
      const element = paperRef.current;

      if (!element) {
        return;
      }

      const positioningStyles = getPositioningStyles(element);
      element.style.top = positioningStyles.top;
      element.style.left = positioningStyles.left;
    },
    [getPositioningStyles]
  );

  const onEntering = () => {
    setPositioningStyles();
  };

  // did mount
  React.useEffect(() => {
    if (open) {
      setPositioningStyles();
    }
  }, []);

  React.useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleResize = debounce(() => {
      setPositioningStyles();
    });

    const containerWindow = ownerWindow(resolveAnchorEl(anchorEl));
    containerWindow.addEventListener('resize', handleResize);

    return () => {
      handleResize.clear();
      containerWindow.addEventListener('resize', handleResize);
    };
  }, [anchorEl, open, setPositioningStyles]);

  const container = anchorEl
    ? ownerDocument(resolveAnchorEl(anchorEl)).body
    : undefined;

  return (
    <PopoverRoot
      open={open}
      ref={ref}
      disablePortal={disablePortal}
      container={container}
      backdropProps={{ invisible: true }}
      {...other}
    >
      <TransitionComponent
        appear
        in={open}
        timeout={transitionDuration}
        onEntering={onEntering}
      >
        <PopoverPaper
          ref={paperRef}
          style={{
            ...style,
          }}
        >
          {children}
        </PopoverPaper>
      </TransitionComponent>
    </PopoverRoot>
  );
});

export default Popover;

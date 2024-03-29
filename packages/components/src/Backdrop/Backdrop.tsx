import React from 'react';
import { forwardRef } from '../system';
import styled, { StyledComponentProps } from 'styled-components';
import { Fade } from '../Transitions';
export interface BackdropProps
  extends StyledComponentProps<'div', any, {}, never> {
  open: boolean;
  invisible?: boolean;
  transitionDuration?:
    | number
    | { appear?: number; enter?: number; exit?: number };
}

const BackdropRoot = styled.div<Pick<BackdropProps, 'invisible'>>`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: ${(props) =>
    props.invisible ? 'transparent' : 'rgba(0, 0, 0, 0.5)'};
  -webkit-tap-highlight-color: transparent;
`;

const Backdrop = forwardRef<BackdropProps, 'div'>(function Backdrop(
  props,
  ref?
) {
  const { children, invisible, open, transitionDuration, ...other } = props;
  return (
    <Fade in={open} timeout={transitionDuration}>
      <BackdropRoot ref={ref} invisible={invisible} {...other}>
        {children}
      </BackdropRoot>
    </Fade>
  ) as any;
});

export default Backdrop;

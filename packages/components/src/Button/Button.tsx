import React from 'react';
import styled from 'styled-components';
import ButtonBase from '../ButtonBase';
import { ButtonBaseProps } from '../ButtonBase/ButtonBase';

export interface ButtonProps extends ButtonBaseProps {}

const ButtonRoot = styled(ButtonBase)`
  outline: 0; // reset default style
  font-size: 16px;
  padding: 6px 16px;
  min-height: 36px;
  color: #fff;
  border-radius: 4px;
  position: relative;
  background-color: rgb(25, 118, 210);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
    rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px;
`;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  props,
  ref?
) {
  const { children, ...other } = props;

  return <ButtonRoot {...other}>{children}</ButtonRoot>;
});

export default Button;

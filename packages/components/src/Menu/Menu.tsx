import React from 'react';
import { forwardRef } from '../system';
import styled from 'styled-components';
import Popover, { PopoverProps } from '../Popover';

const MenuRoot = styled(Popover)``;

const MenuMenuList = styled.ul`
  list-style: none;
  margin: 0px;
  padding: 8px 0px;
  position: relative;
  outline: 0px;
`;

export interface MenuProps extends PopoverProps {}

const Menu = forwardRef<MenuProps, 'div'>(function Menu(props, ref?) {
  const { children, ...other } = props;

  return (
    <MenuRoot ref={ref} {...other}>
      <MenuMenuList>{children}</MenuMenuList>
    </MenuRoot>
  );
});

export default Menu;

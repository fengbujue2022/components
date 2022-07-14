import React from 'react';
import styled from 'styled-components';
import Popover from '../Popover';

const MenuRoot = styled(Popover)``;

const MenuListRoot = styled.ul`
  list-style: none;
  margin: 0px;
  padding: 8px 0px;
  position: relative;
  outline: 0px;
`;

const Menu = React.forwardRef<HTMLDivElement, React.PropsWithChildren<any>>(
  function Menu(props, ref?) {
    const { children, component = 'ul', ...other } = props;

    return (
      <MenuRoot ref={ref} {...other}>
        <MenuListRoot as={component}>{children}</MenuListRoot>
      </MenuRoot>
    );
  }
);

export default Menu;

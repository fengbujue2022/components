import React from 'react';
import styled from 'styled-components';
import { ButtonBase } from '..';
import {
  generateUtilityClasses,
  makeGetUtilityClass,
} from '../utils/generateUtilityClasses';
import composeClasses from '../utils/composeClasses';
import { forwardRef } from '../system';

const componentName = 'MenuItem';
const menuItemClasses = generateUtilityClasses(componentName, ['selected']);

const useUtilityClasses = (ownerState: { selected: boolean }) => {
  const { selected } = ownerState;
  const slot = {
    root: [selected && 'selected'],
  };
  return composeClasses(slot, makeGetUtilityClass(componentName));
};

const MenuItemRoot = styled(ButtonBase)`
  -webkit-tap-highlight-color: transparent;
  background-color: transparent;
  outline: 0px;
  border: 0px;
  margin: 0px;
  border-radius: 0px;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  color: inherit;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
  letter-spacing: 0.00938em;
  display: flex;
  -webkit-box-pack: start;
  justify-content: flex-start;
  -webkit-box-align: center;
  align-items: center;
  position: relative;
  text-decoration: none;
  min-height: 48px;
  padding: 6px 16px;
  box-sizing: border-box;
  white-space: nowrap;

  &:hover {
    background-color: #e0e0e0;
  }

  &.${menuItemClasses.selected} {
    background-color: rgba(25, 118, 210, 0.08);
  }
`;

export interface MenuItemProps {
  selected?: boolean;
  children?: React.ReactNode;
}

const MenuItem = forwardRef<MenuItemProps, 'li'>(function Menu(props, ref?) {
  const { selected = false, ...other } = props;
  const classes = useUtilityClasses({ selected });
  return <MenuItemRoot className={classes.root} component={'li'} {...other} />;
});

export default MenuItem;

import React from 'react';
import styled from 'styled-components';
import { Menu } from '..';
import useControlled from '../hooks/useControlled';
import useForkRef from '../hooks/useForkRef';
import getValidChildren from '../utils/getValidChildren';

const SelectSelect = styled.div`
  -moz-appearance: none;
  -webkit-appearance: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border-radius: 0;
  cursor: pointer;
  font: inherit;
  letter-spacing: inherit;
  color: currentColor;
  padding: 4px 0 5px;
  border: 0;
  box-sizing: content-box;
  background: none;
  height: 1.4375em;
  margin: 0;
  -webkit-tap-highlight-color: transparent;
  display: block;
  min-width: 0;
  width: 100%;
  -webkit-animation-name: mui-auto-fill-cancel;
  animation-name: mui-auto-fill-cancel;
  -webkit-animation-duration: 10ms;
  animation-duration: 10ms;
  outline: 0;
`;

const SelectNativeInput = styled.input`
  bottom: 0px;
  left: 0px;
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 100%;
  box-sizing: border-box;
`;

const SelectInput = React.forwardRef<HTMLInputElement, any>(
  function SelectInput(props, ref?) {
    const {
      autoFocus,
      children,
      defaultOpen,
      defaultValue,
      error,
      name,
      onBlur,
      onChange,
      onFocus,
      open: openProp,
      value: valueProp,
      ...other
    } = props;
    const [value, setValueState] = useControlled({
      controlled: valueProp,
      default: defaultValue,
    });
    const [openState, setOpenState] = useControlled({
      controlled: openProp,
      default: defaultOpen,
    });

    const inputRef = React.useRef<HTMLInputElement>(null);
    const displayRef = React.useRef<HTMLDivElement | null>(null);
    const [displayNode, setDisplayNode] = React.useState<HTMLDivElement | null>(
      null
    );
    const handleRef = useForkRef(ref, inputRef);

    const handleDisplayNodeRef = React.useCallback((node: any) => {
      displayRef.current = node;
      if (node) {
        setDisplayNode(node);
      }
    }, []);

    React.useImperativeHandle(
      handleRef,
      () => ({
        ...(inputRef.current as any),
        focus: () => {
          displayRef.current?.focus();
          setOpenState(true);
        },
      }),
      [setOpenState]
    );

    const childrenArray = getValidChildren(children);

    const makeHandleItemClick =
      (child: React.ReactElement) =>
      (event: React.MouseEvent<HTMLDivElement>) => {
        const newValue = child.props.value;

        if (child.props.onClick) {
          child.props.onClick(event);
        }

        if (value !== newValue) {
          setValueState(newValue);
          if (onChange) {
            const nativeEvent = event.nativeEvent || event;
            // @ts-ignore
            const clonedEvent = new nativeEvent.constructor(
              nativeEvent.type,
              nativeEvent
            );

            Object.defineProperty(clonedEvent, 'target', {
              writable: true,
              value: { value: newValue, name },
            });
            onChange(clonedEvent, child);
          }
        }

        update(false);
      };

    const items = childrenArray.map((child) => {
      const childValue = child.props.value;
      const selected = childValue === value;

      return React.cloneElement(child, {
        onClick: makeHandleItemClick(child),
        role: 'option',
        selected: selected,
        value: undefined,
        'data-value': value,
      });
    });

    const update = (open: boolean) => {
      setOpenState(open);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      displayRef.current?.focus();
      update(true);
    };

    const handleClose = () => {
      update(false); // TODO
    };

    const minWidth = displayNode?.clientWidth;
    const open = displayNode !== null && openState;

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
      // TODO if (!open && onBlur)
      if (onBlur) {
        Object.defineProperty(event, 'target', {
          writable: true,
          value: { value, name },
        });
        onBlur(event);
      }
    };

    return (
      <React.Fragment>
        <SelectSelect
          ref={handleDisplayNodeRef}
          tabIndex={0}
          role="button"
          onMouseDown={handleMouseDown}
          onBlur={handleBlur}
          onFocus={onFocus}
          {...other}
        >
          {value}
        </SelectSelect>
        <SelectNativeInput
          ref={ref}
          autoFocus={autoFocus}
          onChange={onChange}
        ></SelectNativeInput>
        <Menu
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          anchorEl={displayNode}
          onClose={handleClose}
          style={{ minWidth: minWidth }}
        >
          {items}
        </Menu>
      </React.Fragment>
    );
  }
);

export default SelectInput;

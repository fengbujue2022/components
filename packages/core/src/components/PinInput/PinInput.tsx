import React from 'react';
import styled from 'styled-components';
import Input from '../Input';
import getValidChildren from '@components/core/src/utils/getValidChildren';
import hasValue from '@components/core/src/utils/hasValue';
import { useControllableState } from '@components/core/src/hooks/useControllableState';

export interface PinInputContextValue {
  getInputProps: (index: number) => {
    onChange: (event: React.ChangeEvent<any>) => void;
    onKeyDown: (event: React.KeyboardEvent<any>) => void;
    value: string;
  };
}

const PinInputContext = React.createContext<PinInputContextValue | null>(null);

const usePinInputContext = function () {
  return React.useContext(PinInputContext);
};

const toArray = (value?: string) => value?.split('');

export interface PinInputProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
  value?: string;
}

const PinInput = function PinInput(
  props: React.PropsWithChildren<PinInputProps>
) {
  const {
    children,
    defaultValue,
    onChange: onChangeProp,
    value: valueProp,
  } = props;

  const [values, setValues] = useControllableState({
    value: toArray(valueProp) || [],
    defaultValue: defaultValue ? [] : toArray(defaultValue),
    onChange: (values) => onChangeProp?.(values.join('')),
  });

  const childrenMapRef = React.useRef(new Map<number, any>());
  const makeHandleChildRef =
    (index: number) => (childInstance: typeof PinInputField) => {
      childrenMapRef.current.set(index, childInstance);
    };

  const clones = getValidChildren(children).map((child, index) => {
    return React.cloneElement(child, {
      ref: makeHandleChildRef(index),
      index,
      'data-index': index,
    });
  });

  const setValue = React.useCallback(
    (value: string, index: number) => {
      setValues((oldValues) => {
        const nextValues = [...oldValues];
        nextValues[index] = value;
        return nextValues;
      });
    },
    [setValues]
  );

  const getNextValue = React.useCallback(
    (value: string, eventValue: string) => {
      let nextValue = eventValue;
      if (value?.length > 0) {
        if (value[0] === eventValue.charAt(0)) {
          nextValue = eventValue.charAt(1);
        } else if (value[0] === eventValue.charAt(1)) {
          nextValue = eventValue.charAt(0);
        }
      }
      return nextValue;
    },
    []
  );

  const getChildRef = React.useCallback((index: number) => {
    if (childrenMapRef.current.has(index)) {
      return childrenMapRef.current.get(index);
    }
    return null;
  }, []);

  const focusNext = React.useCallback(
    (nextIndex: number) => {
      getChildRef(nextIndex)?.focus();
    },
    [getChildRef]
  );

  const getInputProps = React.useCallback(
    (index: number) => {
      const onChange = (event: React.ChangeEvent<any>) => {
        const eventValue = event.target.value;
        const nextValue = getNextValue(values[index], eventValue);
        if (nextValue.length > 2) {
          // in case of copy and paste
          const nextValue = eventValue
            .split('')
            .filter((_: any, i: number) => i < clones.length);

          setValues([...nextValue]);
        } else {
          if (hasValue(nextValue)) {
            setValue(nextValue, index);
            if (nextValue !== '') {
              focusNext(index + 1);
            }
          }
        }
      };

      const onKeyDown = (event: React.KeyboardEvent<any>) => {
        if (event.key === 'Backspace') {
          focusNext(index - 1);
        }
      };

      return {
        onChange,
        onKeyDown,
        value: values[index] || '',
      };
    },
    [clones.length, focusNext, getNextValue, setValue, setValues, values]
  );

  const contextValue: PinInputContextValue = {
    getInputProps,
  };

  return (
    <PinInputContext.Provider value={contextValue}>
      {clones}
    </PinInputContext.Provider>
  );
};

const StyledPinInputField = styled(Input)`
  max-width: 40px;
  text-align: center;
`;

export const PinInputField = React.forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<any>
>(function PinInputField(props, ref) {
  const { index, ...other } = props;
  const { getInputProps } = usePinInputContext()!;
  const inputProps = getInputProps(index);

  return <StyledPinInputField ref={ref} {...inputProps} {...other} />;
});

export default PinInput;

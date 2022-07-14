import React from 'react';
import { useCallbackRef } from './useCallbackRef';

export interface UseControllableStateProps<T> {
  value?: T;
  defaultValue?: T | (() => T);
  onChange?: (value: T) => void;
  shouldUpdate?: (prev: T, next: T) => boolean;
}

function isFunction<T extends Function = Function>(value: any): value is T {
  return typeof value === 'function';
}

function runIfFn<T, U>(
  valueOrFn: T | ((...fnArgs: U[]) => T),
  ...args: U[]
): T {
  return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn;
}

export function useControllableState<T>(props: UseControllableStateProps<T>) {
  const {
    value: valueProp,
    defaultValue,
    onChange,
    shouldUpdate = (prev, next) => prev !== next,
  } = props;
  const onChangeProp = useCallbackRef(onChange);
  const shouldUpdateProp = useCallbackRef(shouldUpdate);

  const [valueState, setValue] = React.useState(defaultValue as T);

  const isControlled = valueProp !== undefined;
  const value = isControlled ? (valueProp as T) : valueState;

  const updateValue = React.useCallback(
    (next: React.SetStateAction<T>) => {
      const nextValue = runIfFn(next, value);

      if (!shouldUpdateProp(value, nextValue)) {
        return;
      }

      if (!isControlled) {
        setValue(nextValue);
      }

      onChangeProp(nextValue);
    },
    [isControlled, onChangeProp, value, shouldUpdateProp]
  );

  return [value, updateValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}

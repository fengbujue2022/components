import React from 'react';
import { forwardRef } from '../system';
import { Input } from '..';
import SelectInput, { SelectInputProps } from './SelectInput';
import { InputProps } from 'src/Input/Input';

export interface SelectProps extends InputProps, SelectInputProps {
  label?: string;
}

const Select = forwardRef<React.PropsWithChildren<SelectProps>, 'input'>(
  function Select(props, ref?) {
    const { autoFocus, children, error, onChange, value, ...other } = props;

    return (
      <Input
        ref={ref}
        autoFocus={autoFocus}
        error={error}
        inputComponent={SelectInput}
        onChange={onChange}
        value={value}
        {...other}
      >
        {children}
      </Input>
    );
  }
);

export default Select;

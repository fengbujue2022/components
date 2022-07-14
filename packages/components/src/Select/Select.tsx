import React from 'react';
import { Input } from '..';
import SelectInput from './SelectInput';

export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

const Select = React.forwardRef<HTMLInputElement, React.PropsWithChildren<any>>(
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
        inputProps={{ children, ...other }}
      />
    );
  }
);

export default Select;

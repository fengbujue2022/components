import React from 'react';
import styled from 'styled-components';
import FormControl from '../FormControl/FormControl';
import FormLabel from '../FormLabel/FormLabel';
import Input from '../Input';
import { InputProps } from '../Input/Input';

export interface TextFieldProps extends InputProps {
  label?: string;
  focused?: boolean;
  filled?: boolean;
  required?: boolean;
}

const TextFieldRoot = styled(FormControl)``;

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(props, ref?) {
    const { filled, focused, label, required, ...other } = props;
    const formControlState = {
      focused,
      filled,
      required,
    };

    return (
      <TextFieldRoot {...formControlState}>
        {label && <FormLabel>{label}</FormLabel>}
        <Input ref={ref} {...other} />
      </TextFieldRoot>
    );
  }
);

export default TextField;

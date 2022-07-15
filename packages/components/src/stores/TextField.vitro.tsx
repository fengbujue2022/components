import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import PinInput from '../PinInput';
import { PinInputField } from '../PinInput/PinInput';
import TextField from '../TextField';

const HStack = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  & div {
    margin-right: 10px;
  }
`;

export const Example: React.FC = (props) => {
  const [value, setValue] = React.useState('');
  const handleChange = useCallback((value: string) => {
    setValue(value);
  }, []);

  return (
    <>
      <TextField readOnly value={value} label="read only" required />
      <HStack>
        <PinInput value={value} onChange={handleChange}>
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
        </PinInput>
      </HStack>
    </>
  );
};

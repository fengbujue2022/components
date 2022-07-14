import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { Select, FormLabel, FormControl, MenuItem } from '../components';

export const SelectExample: React.FC = (props) => {
  const [selectValue, setSelectValue] = React.useState(null);
  const handleChange = (event: React.ChangeEvent<any>) => {
    const newValue = event.target.value;
    setSelectValue(newValue);
  };

  return (
    <FormControl>
      <FormLabel>{'Field'}</FormLabel>
      <Select
        autoFocus
        error
        value={selectValue}
        onChange={handleChange}
        style={{ minWidth: '120px' }}
      >
        <MenuItem>None</MenuItem>
        <MenuItem value={1}>option-1</MenuItem>
        <MenuItem value={2}>option-2</MenuItem>
        <MenuItem value={3}>option-3</MenuItem>
      </Select>
    </FormControl>
  );
};

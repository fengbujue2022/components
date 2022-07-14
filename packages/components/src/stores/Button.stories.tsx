import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import Button from '../components/Button';

export const RippleEffectButtonExample: React.FC = (props) => {
  return (
    <>
      <Button>{'Ripple effect button'}</Button>
      <Button style={{ marginTop: '50px' }} disableRipple={true}>
        {'Ripple effect disabled button'}
      </Button>
    </>
  );
};

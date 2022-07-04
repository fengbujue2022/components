import React from 'react';
import styled from 'styled-components';
import { FormControlContext } from './useFormControl';
import isFilled from '../../utils/isFilled';

export interface FormControlProps {
  error?: boolean;
  filled?: boolean;
  focused?: boolean;
  required?: boolean;
  disabled?: boolean;
  hiddenLabel?: boolean;
}

const FormControlRoot = styled.div`
  display: inline-flex;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  position: relative;
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0;
  vertical-align: top;
`;

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<FormControlProps>
>(function FormControl(props, ref?) {
  const {
    children,
    disabled = false,
    error = false,
    focused: focusedProp = false,
    hiddenLabel = false,
    required = false,
    ...other
  } = props;

  const [filled, setFilled] = React.useState(() => {
    // We need to iterate through the children and find the Input in order
    // to fully support server-side rendering.
    let initialFilled = false;

    if (children) {
      React.Children.forEach(children, (child) => {
        if (isFilled((child as any).props)) {
          initialFilled = true;
        }
      });
    }

    return initialFilled;
  });

  const [focusedState, setFocused] = React.useState(focusedProp);

  const onFilled = React.useCallback(() => {
    setFilled(true);
  }, []);

  const onEmpty = React.useCallback(() => {
    setFilled(false);
  }, []);

  const contextValue = {
    disabled,
    error,
    filled,
    focused: focusedState,
    hiddenLabel,
    onBlur: () => {
      setFocused(false);
    },
    onFocus: () => {
      setFocused(true);
    },
    onFilled,
    onEmpty,
    required
  };

  return (
    <FormControlContext.Provider value={contextValue}>
      <FormControlRoot ref={ref} {...other}>
        {children}
      </FormControlRoot>
    </FormControlContext.Provider>
  );
});

export default FormControl;

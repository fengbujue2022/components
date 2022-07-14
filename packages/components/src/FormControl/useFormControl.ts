import React from 'react';

export interface FormControlContextValue {
  error: boolean;
  filled: boolean;
  focused: boolean;
  required: boolean;
  disabled: boolean;
  hiddenLabel: boolean;
  onFocus: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onFilled: () => void;
  onEmpty: () => void;
}

const FormControlContext = React.createContext<
  FormControlContextValue | undefined
>(undefined);

function useFormControl() {
  return React.useContext(FormControlContext);
}

export { useFormControl, FormControlContext };

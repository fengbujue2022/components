import clsx from 'clsx';
import React from 'react';
import styled from 'styled-components';
import {
  generateUtilityClasses,
  makeGetUtilityClass,
} from '@components/core/src/utils/generateUtilityClasses';
import isFilled, { TargetObject } from '@components/core/src/utils/isFilled';
import useForkRef from '@components/core/src/hooks/useForkRef';
import composeClasses from '@components/core/src/utils/composeClasses';
import {
  FormControlContextValue,
  useFormControl,
} from '../FormControl/useFormControl';
import useEnhancedEffect from '@components/core/src/hooks/useEnhancedEffect';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  autoFocus?: boolean;
  name?: string;
  value?: string;
  inputComponent?: React.ElementType;
  inputProps?: any;
  error?: boolean;
}

const componentName = 'Input';

const inputClasses = generateUtilityClasses(componentName, [
  'focused',
  'formControl',
  'error',
]);

const useUtilityClasses = (ownerState: {
  error: boolean | undefined;
  focused: boolean;
  formControl: FormControlContextValue | undefined;
}) => {
  const { error, focused, formControl } = ownerState;
  const slot = {
    root: [
      focused && 'focused',
      formControl && 'formControl',
      error && 'error',
    ],
  };
  return composeClasses(slot, makeGetUtilityClass(componentName));
};

const StyledInputRoot = styled.div`
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.4375em;
  letter-spacing: 0.00938em;
  color: rgba(0, 0, 0, 0.87);
  box-sizing: border-box;
  cursor: text;
  display: inline-flex;
  align-items: center;
  position: relative;

  label + & {
    margin-top: 16px;
  }

  &:before {
    border-bottom: 1px solid rgba(0, 0, 0, 0.42);
    left: 0;
    bottom: 0;
    content: '';
    position: absolute;
    right: 0;
    transition: border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    pointer-events: none;
  }

  &:after {
    left: 0;
    bottom: 0;
    content: '';
    position: absolute;
    right: 0;
    transform: scaleX(0);
    transition: transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    pointer-events: none;
  }

  &:hover::before {
    border-bottom: 2px solid rgba(0, 0, 0, 0.42);
  }

  &.${inputClasses.focused + ':after'} {
    transform: scaleX(1);
    border-bottom: 2px solid #1976d2;
  }

  &.${inputClasses.error + ':before'} {
    transform: scaleX(1);
    border-bottom-color: #d32f2f;
  }

  &.${inputClasses.error + ':after'} {
    border-bottom-color: #d32f2f;
  }
`;

const StyledInput = styled.input((prop) => {
  const placeholderHidden = {
    opacity: '0 !important',
  };
  const placeholderVisible = {
    opacity: 0.5,
  };
  return {
    outline: 0, // reset default style
    font: 'inherit',
    letterSpacing: 'inherit',
    color: 'currentColor',
    padding: '4px 0 5px',
    border: 0,
    boxSizing: 'content-box',
    background: 'none',
    height: '1.4375em',
    margin: 0,
    '-webkit-tap-highlight-color': 'transparent',
    display: 'block',
    minWidth: 0,
    width: '100%',
    [`label[data-shrink=false] + .${inputClasses.formControl} &`]: {
      '&::-webkit-input-placeholder': placeholderHidden,
      '&::-moz-placeholder': placeholderHidden, // Firefox 19+
      '&:-ms-input-placeholder': placeholderHidden, // IE11
      '&::-ms-input-placeholder': placeholderHidden, // Edge
      '&:focus::-webkit-input-placeholder': placeholderVisible,
      '&:focus::-moz-placeholder': placeholderVisible, // Firefox 19+
      '&:focus:-ms-input-placeholder': placeholderVisible, // IE11
      '&:focus::-ms-input-placeholder': placeholderVisible, // Edge
    },
  };
});

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  props,
  ref
) {
  const {
    autoFocus,
    error,
    inputComponent,
    inputProps,
    name,
    onBlur,
    onChange,
    onFocus,
    value,
    ...other
  } = props;
  const formControl = useFormControl();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleRef = useForkRef(ref, inputRef);
  const [focused, setFocused] = React.useState(false);

  const onFilled = formControl && formControl.onFilled;
  const onEmpty = formControl && formControl.onEmpty;

  const checkDirty = React.useCallback(
    (obj: TargetObject) => {
      if (isFilled(obj)) {
        if (onFilled) {
          onFilled();
        }
      } else if (onEmpty) {
        onEmpty();
      }
    },
    [onFilled, onEmpty]
  );

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (onFocus) {
      onFocus(event);
    }

    if (formControl?.onFocus) {
      formControl.onFocus(event);
    } else {
      setFocused(true);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(event);
    }

    if (formControl?.onBlur) {
      formControl.onBlur(event);
    } else {
      setFocused(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const element = event.target || inputRef.current;
    checkDirty({
      value: element.value,
    });

    if (onChange) {
      onChange(event);
    }
  };

  useEnhancedEffect(() => {
    checkDirty({ value });
  }, [value, checkDirty]);

  React.useEffect(() => {
    checkDirty({ value });
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, []);

  const ownerState = {
    error,
    focused: formControl?.focused || focused,
    formControl,
  };

  const classes = useUtilityClasses(ownerState);

  const Input = inputComponent || StyledInput;

  return (
    <StyledInputRoot className={clsx(classes.root)}>
      <Input
        name={name}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        ref={handleRef}
        value={value}
        {...inputProps}
        {...other}
      />
    </StyledInputRoot>
  );
});

export default Input;

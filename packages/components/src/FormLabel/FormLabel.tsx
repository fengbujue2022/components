import React, { LabelHTMLAttributes } from 'react';
import { forwardRef } from '../system';
import styled from 'styled-components';
import { useFormControl } from '../FormControl/useFormControl';

const FormLabelRoot = styled.label`
  color: rgba(0, 0, 0, 0.6);
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.4375em;
  letter-spacing: 0.00938em;
  padding: 0;
  position: relative;
  display: block;
  transform-origin: top left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(0, 20px) scale(1);
  transition: color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    max-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

  &[data-shrink='true'] {
    transform: translate(0, -1.5px) scale(0.75);
  }
`;

export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const FormLabel = forwardRef<FormLabelProps, 'label'>(function FormLabel(
  props,
  ref?
) {
  const { children, ...other } = props;
  const formControl = useFormControl();

  const required = formControl?.required ?? false;

  let shrink = false;
  if (formControl) {
    shrink = formControl.focused || formControl.filled;
  }

  return (
    <FormLabelRoot ref={ref} data-shrink={shrink} {...other}>
      {children}
      {required && <span>*</span>}
    </FormLabelRoot>
  );
});

export default FormLabel;

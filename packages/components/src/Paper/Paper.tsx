import React from 'react';
import styled from 'styled-components';

const PaperRoot = styled.div`
  background-color: rgb(255, 255, 255);
  color: rgba(0, 0, 0, 0.87);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px,
    rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
`;

const Paper = React.forwardRef<HTMLDivElement, React.PropsWithChildren<any>>(
  function Paper(props, ref?) {
    const { ...other } = props;
    return <PaperRoot ref={ref} {...other} />;
  }
);

export default Paper;

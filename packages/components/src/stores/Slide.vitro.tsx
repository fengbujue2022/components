import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import Slide from '../components/Transitions/Slide';

export const SlideExample: React.FC = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(
    null
  );
  const [open, setOpen] = React.useState(false);
  const handleContainerNodeRef = useCallback((node: HTMLDivElement) => {
    // @ts-ignore
    containerRef.current = node;
    if (node) {
      setContainerNode(node);
    }
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 1000);
  }, []);

  return (
    <div
      ref={handleContainerNodeRef}
      style={{
        height: '200px',
        width: '300px',
        backgroundColor: 'gray',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Slide
        in={open}
        appear
        mountOnEnter
        direction="right"
        container={containerNode}
      >
        <div style={{ display: 'inline-flex' }}>{'This is a text'}</div>
      </Slide>
    </div>
  );
};

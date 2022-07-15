import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import Button from '../Button';
import { Slide } from '..';

const DialogContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  outline: 0px;
  height: 100%;
`;

const Paper = styled.div`
  background-color: rgb(255, 255, 255);
  color: rgba(0, 0, 0, 0.87);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 11px 15px -7px,
    rgba(0, 0, 0, 0.14) 0px 24px 38px 3px, rgba(0, 0, 0, 0.12) 0px 9px 46px 8px;
  margin: 32px;
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  max-height: calc(100% - 64px);
  max-width: 600px;
`;

const DialogTitle = styled.div`
  margin: 0px;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-weight: 500;
  font-size: 1.25rem;
  line-height: 1.6;
  letter-spacing: 0.0075em;
  padding: 16px 24px;
  flex: 0 0 auto;
`;

const DialogContent = styled.div`
  margin: 0px;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-weight: 500;
  font-size: 1.25rem;
  line-height: 1.6;
  letter-spacing: 0.0075em;
  padding: 16px 24px;
  flex: 0 0 auto;
`;

const DialogActions = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  padding: 8px;
  -webkit-box-pack: end;
  justify-content: flex-end;
  flex: 0 0 auto;
`;

export const ModalExample: React.FC = (props) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Button onClick={handleOpen}>Show modal</Button>
      <Modal open={open} onClose={handleClose} keepMounted>
        <Slide in={open}>
          <DialogContainer>
            <Paper>
              <DialogTitle>天赋异禀</DialogTitle>
              <DialogContent>
                {
                  '"桌坛新星，10500分， 我只有101分，但是他并不是我的对手，我的分很低，但是却很强， 因为我一分抵别人一伯分， 为什么这么说呢，因为我 天赋-异-禀."'
                }
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Agree</Button>
              </DialogActions>
            </Paper>
          </DialogContainer>
        </Slide>
      </Modal>
    </div>
  );
};

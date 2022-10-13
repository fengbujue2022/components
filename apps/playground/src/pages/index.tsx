import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { images } from '../data/images';
import styled from 'styled-components';
import {
  Button,
  Fade,
  FormControl,
  FormLabel,
  MenuItem,
  Modal,
  Select,
  SharedElement,
  Slide,
  VirtualizedList,
} from 'components';
import { generateKey } from '../helpers/generateKey';
import { VirtualizedListHandle } from 'components/src/VirtualizedList/VirtualizedList';
import useEnhancedEffect from 'components/src/hooks/useEnhancedEffect';

const GalleryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  flex-grow: 1;
  padding: 40px;
`;

const ImageBox = styled.div`
  margin: 10px;
  border-radius: 8px;
  overflow: hidden;
  > * {
    vertical-align: middle;
  }
`;

const HStack = styled.div`
  display: flex;
  flex-direction: row;
  // justify-content: space-between;
  align-items: center;
  width: 300;
  & div {
    margin-right: 10px;
  }
`;

const Index = function () {
  const girdNumber = 6;

  return (
    <>
      <GalleryContainer>
        {images.map((img, index) => {
          if (!img) {
            console.error('img is null');
          }
          return (
            <Link key={index} href={`/${index}`}>
              <div
                style={{
                  flexBasis: 100 / girdNumber + '%',
                  flexGrow: 0,
                }}
              >
                <SharedElement port={generateKey('profile', index)}>
                  <ImageBox>
                    <Image
                      src={img}
                      width={512}
                      height={512}
                      layout={'intrinsic'}
                      alt={'alt'}
                    />
                  </ImageBox>
                </SharedElement>
              </div>
            </Link>
          );
        })}
        <VirtualizedListExample />
        <ModalExample />
        <SelectExample />
      </GalleryContainer>
    </>
  );
};

const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  &.dark {
    background: #e5e5e5;
  }
`;

const VirtualizedListExample = () => {
  const virtualListRef = React.useRef<VirtualizedListHandle | null>(null);

  useEnhancedEffect(() => {
    virtualListRef.current?.scrollToIndex({
      index: 666,
      behavior: 'smooth',
    });
  }, []);

  return (
    <VirtualizedList
      ref={virtualListRef}
      height={'500px'}
      width={'300px'}
      itemCount={1000}
      getItemSize={() => 50}
      renderItem={(item) => {
        return (
          <Item
            key={item.index}
            className={`item ${item.index % 2 ? 'dark' : ''}`}
            style={{
              height: `${item.size}px`,
            }}
          >
            ♻️ {item.index}
          </Item>
        );
      }}
    />
  );
};

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

export const ModalExample: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Button onClick={handleOpen}>Show modal</Button>
      <Modal open={open} onClose={handleClose}>
        <Slide in appear>
          <DialogContainer>
            <Paper>
              <DialogTitle>天赋异禀</DialogTitle>
              <DialogContent>
                {
                  '"桌坛新星，10500分， 我只有101分，但是他并不是我的对手，我的分很低，但是却很强， 因为我一分抵别人一伯分， 为什么这么说呢，因为我 天赋-异-禀."'
                }
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>OK</Button>
              </DialogActions>
            </Paper>
          </DialogContainer>
        </Slide>
      </Modal>
    </div>
  );
};

const SelectExample: React.FC = () => {
  const [selectValue, setSelectValue] = React.useState('');
  const handleChange = (event: React.ChangeEvent<any>) => {
    const newValue = event.target.value;
    setSelectValue(newValue);
  };

  return (
    <FormControl>
      <FormLabel>{'Field'}</FormLabel>
      <Select
        autoFocus
        label="Select"
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

export default Index;

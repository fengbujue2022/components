import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { images } from '../data/images';
import styled from 'styled-components';
import { SharedElement, VirtualizedList } from 'components';
import { generateKey } from '../helpers/generateKey';

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
      </GalleryContainer>
    </>
  );
};

const VirtualizedListExample = () => {
  return <VirtualizedList />;
};

export default Index;

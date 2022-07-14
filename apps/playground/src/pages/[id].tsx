import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Button, SharedElement } from 'components';
import { images } from '../data/images';
import { generateKey } from '../helpers/generateKey';
import Link from 'next/link';

const Root = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const Detail: React.FC = function (props: {}) {
  const router = useRouter();

  const index = React.useMemo(() => {
    let id = router.query['id'];
    return id !== undefined ? Number(id) : id;
  }, [router.query]);

  if (index === undefined) {
    return <div>no data</div>;
  }

  const src = images[index];

  return (
    <Root>
      <Box>
        <div
          style={{
            flexBasis: '200px',
          }}
        >
          <SharedElement port={generateKey('profile', index)}>
            <div
              style={{
                borderRadius: '100px',
                overflow: 'hidden',
              }}
            >
              <Image src={src} width={512} height={512} layout={'responsive'} />
            </div>
          </SharedElement>
        </div>
        <p style={{ flex: 1, padding: '0px 20px' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Box>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Link href="/">
          <Button>GO BACK</Button>
        </Link>
      </div>
    </Root>
  );
};

export default Detail;

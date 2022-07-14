import React from 'react';
import type { AppProps } from 'next/app';
import { SharedHost } from 'components';

function App({ Component, pageProps }: AppProps) {
  return (
    <SharedHost>
      <Component {...pageProps} />
    </SharedHost>
  );
}

export default App;

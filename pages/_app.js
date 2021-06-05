import '../styles/global.css';
import React from 'react';

// eslint-disable-next-line react/prop-types
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}

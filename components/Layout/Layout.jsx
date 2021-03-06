import classnames from 'classnames/bind';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import styles from './Layout.module.css';
import PropTypes from 'prop-types';

const cx = classnames.bind(styles);

export default function Layout({ children, home }) {
  return (
    <div className={cx('container')}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
      {!home && (
        <div className={cx('backToHome')}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
  home: PropTypes.bool,
}

Layout.defaultProps = {
  children: null,
  home: false,
}

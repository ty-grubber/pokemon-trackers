import classnames from 'classnames/bind';
import Head from 'next/head';
import React from 'react';
import Layout from '../../components/Layout';
import UnderConstruction from '../UnderConstruction';
import styles from './FIRTrackerPage.module.css';

const cx = classnames.bind(styles);

export default function FIRTrackerPage() {
  return (
    <Layout>
      <Head>
        <title>Pokemon Crystal Full Item Randomizer Tracker</title>
        <meta
          name="description"
          content="Track all item locations and key items for Pokemon Crystal in our FIR Tracker!"
        />
        <meta name="og:title" content="Pokemon Crystal FIR Tracker" />
      </Head>

      <header className={cx('header')}>
        <h1>Pokemon Crystal FIR Tracker</h1>
      </header>
      <section>
        <UnderConstruction />
      </section>
    </Layout>
  )
}

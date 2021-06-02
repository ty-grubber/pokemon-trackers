import classnames from 'classnames/bind';
import Head from 'next/head';
import React from 'react';
import Layout from '../../components/Layout';
import UnderConstruction from '../UnderConstruction';
import styles from './KIRTrackerPage.module.css';

const cx = classnames.bind(styles);

export default function KIRTrackerPage() {
  return (
    <Layout>
      <Head>
        <title>Pokemon Crystal Key Item Randomizer Tracker</title>
        <meta
          name="description"
          content="Track all key items for Pokemon Crystal in our FIR Tracker!"
        />
        <meta name="og:title" content="Pokemon Crystal FIR Tracker" />
      </Head>

      <header>
        <h1>Pokemon Crystal KIR Tracker</h1>
      </header>
      <section>
        <UnderConstruction />
      </section>
    </Layout>
  )
}

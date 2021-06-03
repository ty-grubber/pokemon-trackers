import classnames from 'classnames/bind';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Layout from '../../components/Layout';
import utilStyles from '../../styles/utils.module.css';
import styles from './HomePage.module.css';

const ucx = classnames.bind(utilStyles);
const cx = classnames.bind(styles);

export default function HomePage() {
  return (
    <Layout home>
      <Head>
        <title>Pokedex Trackers Home</title>
        <meta
          name="description"
          content="Keep track of everything you need for your pokemon randomizers"
        />
        <meta name="og:title" content="Pokemon Trackers" />
      </Head>
      <header className={cx('header')}>
        <Image
          priority
          src="/images/tiger-sigil.jpg"
          className={ucx('borderCircle')}
          width={75}
          height={100}
          alt="Tiger Image"
        />
        <h1 className={ucx('heading2Xl')}>Pokemon Trackers</h1>
      </header>
      <section className={ucx('headingMd')}>
        <h2>Pokedex Trackers</h2>
        <Link href="/pokedex/minesweeper">
          <a>Minesweeper</a>
        </Link>
        <br />
        <h2>Pokemon Crystal Item Trackers</h2>
        <Link href="/items/crystal/fir">
          <a>Full Item Tracker</a>
        </Link>
        <br />
        <Link href="/items/crystal/kir">
          <a>Key Item Tracker</a>
        </Link>
      </section>
    </Layout>
  )
}

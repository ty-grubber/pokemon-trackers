import classnames from 'classnames/bind';
import Head from 'next/head';
import React from 'react';
import Layout from '../../Layout';
import UnderConstruction from '../../UnderConstruction';
import styles from './PDMinesweeperPage.module.css';

const cx = classnames.bind(styles);

export default function Minesweeper() {
  return (
    <Layout>
      <Head>
        <title>Pokedex Minesweeper</title>
        <meta
          name="description"
          content="Play Minesweeper using the pokedex as the mining grid"
        />
        <meta name="og:title" content="Pokedex Minesweeper" />
      </Head>

      <header className={cx('header')}>
        <h1>Pokedex Minesweeper</h1>
      </header>
      <section>
        <UnderConstruction />
      </section>
    </Layout>
  )
}

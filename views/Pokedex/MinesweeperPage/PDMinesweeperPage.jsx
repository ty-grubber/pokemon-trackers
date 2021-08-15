import classnames from 'classnames/bind';
import Head from 'next/head';
import React from 'react';
import Grid from '../../../components/Grid';
import Layout from '../../../components/Layout';
import PokedexGrid from '../../../components/PokedexGrid';
import styles from './PDMinesweeperPage.module.css';

const cx = classnames.bind(styles);

const selectedPokeOptions = [
  { clickValue: 0, color: 'white', text: 'Reset', textColor: 'black' },
  { clickValue: 1, color: 'dodgerblue', text: 'Seen' },
  { clickValue: 2, color: 'darkgoldenrod', text: 'Caught' },
  { clickValue: 3, color: 'red', text: 'Flag' },
  { clickValue: 4, color: 'grey', text: 'Mine' },
  { clickValue: 5, color: 'black', text: 'Explode' },
];

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
        <Grid className={cx('trackerGrid')} columns={2}>
          <Grid.Cell className={cx('pokedexContainer')}>
            <PokedexGrid
              columns={16}
              selectedPokeOptions={selectedPokeOptions}
            />
          </Grid.Cell>
          <Grid.Cell className={cx('trackerContainer')}>
            <header className={cx('header')}>
              <h2>Minesweeper</h2>
            </header>
            <div className={cx('countContainer')}>
              Counts go here
            </div>
          </Grid.Cell>
        </Grid>
      </section>
    </Layout>
  )
}

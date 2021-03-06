import classnames from 'classnames/bind';
import Head from 'next/head';
import React, { useCallback, useState } from 'react';
import Grid from '../../../components/Grid';
import Layout from '../../../components/Layout';
import PokedexGrid from '../../../components/PokedexGrid';
import { NATIONAL_DEX } from '../../../lib/constants/pokedex';
import { randomizePokedex } from '../../../lib/utils/randomize';
import styles from './BasicTrackerPage.module.css';

const cx = classnames.bind(styles);

const DEFAULT_TRACKED_VALUES = {
  0: 0,
  1: 0,
  2: NATIONAL_DEX.length,
  3: 0,
  4: 0,
};

export default function BasicTracker() {
  const [clickedValues, setClickedValues] = useState(DEFAULT_TRACKED_VALUES);
  const [pokedexGrid, setPokedexGrid] = useState(NATIONAL_DEX);

  const handleClick = useCallback((newValue, oldValue) => {
    const test = {
      ...clickedValues,
      [newValue]: clickedValues[newValue] + 1,
    };

    if (newValue !== oldValue && test) {
      setClickedValues(currentSet => ({
        ...currentSet,
        [newValue]: currentSet[newValue] + 1,
        [oldValue]: currentSet[oldValue] - 1,
      }));
    }
  }, [clickedValues]);

  const handleRandomize = useCallback(seed => {
    setPokedexGrid(randomizePokedex(seed))
  }, []);

  const handleReset = useCallback(() => {
    setPokedexGrid(NATIONAL_DEX);
  }, []);

  const caughtCount = clickedValues[3] + clickedValues[4];
  const trackedCount = clickedValues[0] + clickedValues[1];
  const untrackedCount = clickedValues[2];

  return (
    <Layout>
      <Head>
        <title>Pokedex Tracker</title>
        <meta
          name="description"
          content="Track pokemon in the pokedex using this tracker"
        />
        <meta name="og:title" content="Pokedex Simple Tracker" />
      </Head>
      <section>
        <Grid className={cx('trackerGrid')} columns={2}>
          <Grid.Cell className={cx('pokedexContainer')}>
            <PokedexGrid
              defaultClickValue={2}
              onCellClick={handleClick}
              onRandomize={handleRandomize}
              onReset={handleReset}
              pokedex={pokedexGrid}
              trackClicks
            />
          </Grid.Cell>
          <Grid.Cell className={cx('trackerContainer')}>
            <header className={cx('header')}>
              <h1>Pokedex Tracker</h1>
            </header>
            <div className={cx('countContainer')}>
              <b>Total Caught: </b> {caughtCount}<br />
              <b>Total Tracked: </b> {trackedCount}<br />
              <b>Total Untracked: </b> {untrackedCount}<br />
            </div>
          </Grid.Cell>
        </Grid>
      </section>
    </Layout>
  )
}

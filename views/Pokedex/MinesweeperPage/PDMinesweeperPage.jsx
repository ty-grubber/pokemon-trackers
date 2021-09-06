import classnames from 'classnames/bind';
import Head from 'next/head';
import React, { useCallback } from 'react';
import Grid from '../../../components/Grid';
import Layout from '../../../components/Layout';
import PokedexGrid from '../../../components/PokedexGrid';
import { NATIONAL_DEX } from '../../../lib/constants/pokedex';
import { convertTo2DArray } from '../../../lib/utils';
import { randomizeArray } from '../../../lib/utils/randomize';
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

const MINE_VALUE = 'M';

export default function Minesweeper() {
  // eslint-disable-next-line no-unused-vars
  const generateMineGrid = useCallback(() => {
    // TODO: change the +5 based on settings (to closest square based on columns)
    const unshuffledMines = Array(NATIONAL_DEX.length + 5).fill(MINE_VALUE, 0, 40).fill(0, 40); // TODO: change 40 based on settings
    const shuffledMines = randomizeArray(unshuffledMines, 'Test seed'); // TODO: change seed based on settings
    const mineGrid = convertTo2DArray(shuffledMines, 16); // TODO: change 16 based on settings
    const numRows = mineGrid.length;
    const numCols = 16; // replace with cols from state when implemented

    // Iterate through mineGrid to put proper adjacent mine numbers in the array
    for (var i = 0; i < numRows; i++) {
      for (var j = 0; j < numCols; j++) {
        // if grid coord is a mine, add 1 to all non-mine adjacent grid coords
        if (mineGrid[i][j] === MINE_VALUE) {
          const isNotLeftEdgeCol = j - 1 >= 0;
          const isNotRightEdgeCol = j + 1 < numCols;

          // Current Row
          if (isNotLeftEdgeCol && mineGrid[i][j - 1] !== MINE_VALUE) {
            mineGrid[i][j - 1] += 1;
          }
          if (isNotRightEdgeCol && mineGrid[i][j + 1] !== MINE_VALUE) {
            mineGrid[i][j + 1] += 1;
          }

          if (i - 1 >= 0) {
            // Previous row exists, so check through valid columns
            if (mineGrid[i - 1][j] !== MINE_VALUE) {
              mineGrid[i - 1][j] += 1;
            }
            if (isNotLeftEdgeCol && mineGrid[i - 1][j - 1] !== MINE_VALUE) {
              mineGrid[i - 1][j - 1] += 1;
            }
            if (isNotRightEdgeCol && mineGrid[i - 1][j + 1] !== MINE_VALUE) {
              mineGrid[i - 1][j + 1] += 1;
            }
          }

          if (i + 1 < numRows) {
            // Next row exists, so check through valid columns
            if (mineGrid[i + 1][j] !== MINE_VALUE) {
              mineGrid[i + 1][j] += 1;
            }
            if (isNotLeftEdgeCol && mineGrid[i + 1][j - 1] !== MINE_VALUE) {
              mineGrid[i + 1][j - 1] += 1;
            }
            if (isNotRightEdgeCol && mineGrid[i + 1][j + 1] !== MINE_VALUE) {
              mineGrid[i + 1][j + 1] += 1;
            }
          }
        }
      }
    }

    // set mineGrid into state
  }, []);

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

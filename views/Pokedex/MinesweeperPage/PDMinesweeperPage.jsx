import classnames from 'classnames/bind';
import Head from 'next/head';
import React, { useCallback, useMemo, useState } from 'react';
import Grid from '../../../components/Grid';
import Layout from '../../../components/Layout';
import PokedexGrid from '../../../components/PokedexGrid';
import { NATIONAL_DEX } from '../../../lib/constants/pokedex';
import { convertTo2DArray } from '../../../lib/utils';
import { randomizeArray } from '../../../lib/utils/randomize';
import styles from './PDMinesweeperPage.module.css';

const cx = classnames.bind(styles);



const MINE = 'M';
const COLUMNS = 16;
const NUM_MINES = 40;

export default function Minesweeper() {
  // eslint-disable-next-line no-unused-vars
  const [mineGrid, setMineGrid] = useState();
  // eslint-disable-next-line no-unused-vars
  const [progressGrid, setProgressGrid] = useState();
  const generateMineGrids = useCallback((inputSeed) => {
    // TODO: change the +5 based on settings (to closest square based on columns)
    const gridLength = NATIONAL_DEX.length + 5;
    const unshuffledMines = Array(gridLength).fill(MINE, 0, NUM_MINES).fill(0, NUM_MINES); // TODO: change 40 based on settings

    const shuffledMines = randomizeArray(unshuffledMines, inputSeed); // TODO: change seed based on settings
    const shuffledMineGrid = convertTo2DArray(shuffledMines, COLUMNS); // TODO: change 16 based on settings
    const numRows = shuffledMineGrid.length;
    const numCols = 16; // replace with cols from state when implemented

    // Iterate through mineGrid to put proper adjacent mine numbers in the array
    for (var i = 0; i < numRows; i++) {
      for (var j = 0; j < numCols; j++) {
        // if grid coord is a mine, add 1 to all non-mine adjacent grid coords
        if (shuffledMineGrid[i][j] === MINE) {
          const isNotLeftEdgeCol = j - 1 >= 0;
          const isNotRightEdgeCol = j + 1 < numCols;

          // Current Row
          if (isNotLeftEdgeCol && shuffledMineGrid[i][j - 1] !== MINE) {
            shuffledMineGrid[i][j - 1] += 1;
          }
          if (isNotRightEdgeCol && shuffledMineGrid[i][j + 1] !== MINE) {
            shuffledMineGrid[i][j + 1] += 1;
          }

          if (i - 1 >= 0) {
            // Previous row exists, so check through valid columns
            if (shuffledMineGrid[i - 1][j] !== MINE) {
              shuffledMineGrid[i - 1][j] += 1;
            }
            if (isNotLeftEdgeCol && shuffledMineGrid[i - 1][j - 1] !== MINE) {
              shuffledMineGrid[i - 1][j - 1] += 1;
            }
            if (isNotRightEdgeCol && shuffledMineGrid[i - 1][j + 1] !== MINE) {
              shuffledMineGrid[i - 1][j + 1] += 1;
            }
          }

          if (i + 1 < numRows) {
            // Next row exists, so check through valid columns
            if (shuffledMineGrid[i + 1][j] !== MINE) {
              shuffledMineGrid[i + 1][j] += 1;
            }
            if (isNotLeftEdgeCol && shuffledMineGrid[i + 1][j - 1] !== MINE) {
              shuffledMineGrid[i + 1][j - 1] += 1;
            }
            if (isNotRightEdgeCol && shuffledMineGrid[i + 1][j + 1] !== MINE) {
              shuffledMineGrid[i + 1][j + 1] += 1;
            }
          }
        }
      }
    }

    const initialProgress = Array(gridLength).fill(0);
    const progressArray = convertTo2DArray(initialProgress, COLUMNS);

    setMineGrid(shuffledMineGrid);
    setProgressGrid(progressArray);
  }, []);

  const updateProgress = useCallback((selectedGrid, progressValue) => {
    setProgressGrid(existingGrid => {
      const newGrid = existingGrid.slice();
      newGrid[selectedGrid.i][selectedGrid.j] = progressValue;
      return newGrid;
    });
  }, []);

  const selectedPokeOptions = useMemo(() => ([
    { clickValue: 0, color: 'grey', text: 'Reset', action: updateProgress },
    { clickValue: 1, color: 'dodgerblue', text: 'Seen', action: updateProgress },
    { clickValue: 2, color: 'darkgoldenrod', text: 'Caught', action: updateProgress },
    { clickValue: 3, color: 'red', text: 'Flag', action: updateProgress },
    { clickValue: 4, color: 'white', text: 'Mine', textColor: 'black', action: updateProgress },
    { clickValue: 5, color: 'black', text: 'Explode', action: updateProgress },
  ]), [updateProgress]);

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
              onRandomize={generateMineGrids}
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

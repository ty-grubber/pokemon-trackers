import classnames from 'classnames/bind';
import Head from 'next/head';
import React, { useCallback, useMemo, useState } from 'react';
import Grid from '../../../components/Grid';
import Layout from '../../../components/Layout';
import PokedexGrid from '../../../components/PokedexGrid';
import { NATIONAL_DEX } from '../../../lib/constants/pokedex';
import { convertTo2DArray } from '../../../lib/utils/arrayConversion';
import { randomizeArray } from '../../../lib/utils/randomize';
import styles from './PDMinesweeperPage.module.css';

const cx = classnames.bind(styles);
const MINE = 	'💥';
const COLUMNS = 16;
const NUM_MINES = 40;
const INITIAL_TRACKER = {
  reset: NATIONAL_DEX.length + 5,
  seen: 0,
  caught: 0,
  flagged: 0,
  mine: 0,
  explosions: 0,
};
const MAP_PROGRESS_TO_TRACKER = {
  0: 'reset',
  1: 'seen',
  2: 'caught',
  3: 'flagged',
  4: 'mine',
  5: 'explosions',
};

export default function Minesweeper() {
  const [mineGrid, setMineGrid] = useState();
  const [progressGrid, setProgressGrid] = useState();
  const [tracker, setTracker] = useState(INITIAL_TRACKER);
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
    const isMineExposed = progressValue === 4 && mineGrid[selectedGrid.i][selectedGrid.j] === MINE;
    const trackerToDecrease = MAP_PROGRESS_TO_TRACKER[progressGrid[selectedGrid.i][selectedGrid.j]];
    const trackerToIncrease = MAP_PROGRESS_TO_TRACKER[progressValue];

    if (!isMineExposed) {
      setTracker(existingTracker => ({
        ...existingTracker,
        [trackerToDecrease]: existingTracker[trackerToDecrease] - 1,
        [trackerToIncrease]: existingTracker[trackerToIncrease] + 1,
      }));
    } else {
      if (trackerToDecrease === 'flagged') {
        // an exposed mine counts as a flagged mine, so no need to update that tracker stat
        setTracker(existingTracker => ({
          ...existingTracker,
          mine: existingTracker.mine + 1,
          explosions: existingTracker.explosions + 1,
        }));
      } else {
        // need to increase flagged and explosions when an unflagged square that has a mine is mined
        setTracker(existingTracker => ({
          ...existingTracker,
          [trackerToDecrease]: existingTracker[trackerToDecrease] - 1,
          flagged: existingTracker.flagged + 1,
          mine: existingTracker.mine + 1,
          explosions: existingTracker.explosions + 1,
        }));
      }
    }

    setProgressGrid(existingGrid => {
      const newGrid = existingGrid.slice();
      newGrid[selectedGrid.i][selectedGrid.j] = progressValue !== 4 ? progressValue : 'X';
      return newGrid;
    });
  }, [mineGrid, progressGrid]);

  const selectedPokeOptions = useMemo(() => ([
    { clickValue: 0, color: 'darkgrey', text: 'Reset', action: updateProgress },
    { clickValue: 1, color: 'dodgerblue', text: 'Seen', action: updateProgress },
    { clickValue: 2, color: 'darkgoldenrod', text: 'Caught', action: updateProgress },
    { clickValue: 3, color: 'red', text: 'Flag', action: updateProgress },
    { clickValue: 4, color: 'white', text: 'Mine', textColor: 'black', action: updateProgress, clearSelected: true },
    { clickValue: 5, color: 'black', text: 'Explode', action: updateProgress, clearSelected: true },
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
              hiddenProgressGrid={progressGrid}
              hiddenValuesGrid={mineGrid}
              onRandomize={generateMineGrids}
              selectedPokeOptions={selectedPokeOptions}
            />
          </Grid.Cell>
          <Grid.Cell className={cx('trackerContainer')}>
            <header className={cx('header')}>
              <h2>Minesweeper</h2>
            </header>
            <div className={cx('countContainer')}>
              <span><b>Mines Remaining:&nbsp;</b>{NUM_MINES - tracker.flagged}</span>
              <br /><br />
              <span><b>Explosions:&nbsp;</b>{tracker.explosions}</span>
              <br /><br />
            </div>
          </Grid.Cell>
        </Grid>
      </section>
    </Layout>
  )
}

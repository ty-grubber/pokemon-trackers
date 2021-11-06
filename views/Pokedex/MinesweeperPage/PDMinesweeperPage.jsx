import classnames from 'classnames/bind';
import Head from 'next/head';
import React, { useCallback, useMemo, useState } from 'react';
import Grid from '../../../components/Grid';
import Layout from '../../../components/Layout';
import PokedexGrid from '../../../components/PokedexGrid';
import { NATIONAL_DEX } from '../../../lib/constants/pokedex';
import { convert2DIndexToIndex, convertTo2DArray, flatten2DArray } from '../../../lib/utils/arrayConversion';
import { randomizeArray, randomizePokedex } from '../../../lib/utils/randomize';
import styles from './PDMinesweeperPage.module.css';

const cx = classnames.bind(styles);
const DEFAULT_GRID_LENGTH = NATIONAL_DEX.length + 5;
const MINE = 	'💥';
const COLUMNS = 16;
const NUM_MINES = 40;
const INITIAL_TRACKER = {
  reset: DEFAULT_GRID_LENGTH,
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
const emptyCell = {
  id: 0,
  matchesSecretValue: false,
  name: '',
  value: 0,
}

function autoMine(progressArr, mineArr, rowIndex, colIndex) {
  if (progressArr && progressArr[rowIndex] && progressArr[rowIndex][colIndex] < 4) {
    // Need to mine current square
    progressArr[rowIndex][colIndex] = 4;

    // Check if we need to mine around it
    if (mineArr[rowIndex][colIndex].value === 0) {
      autoMine(progressArr, mineArr, rowIndex - 1, colIndex);
      autoMine(progressArr, mineArr, rowIndex - 1, colIndex - 1);
      autoMine(progressArr, mineArr, rowIndex - 1, colIndex + 1);
      autoMine(progressArr, mineArr, rowIndex, colIndex - 1);
      autoMine(progressArr, mineArr, rowIndex, colIndex + 1);
      autoMine(progressArr, mineArr, rowIndex + 1, colIndex);
      autoMine(progressArr, mineArr, rowIndex + 1, colIndex - 1);
      autoMine(progressArr, mineArr, rowIndex + 1, colIndex + 1);
    }
  }
}

export default function Minesweeper() {
  const defaultGrid = useMemo(() => Array(DEFAULT_GRID_LENGTH).fill({ value: 0 }).map((cell, index) => {
    const pokeInfo = NATIONAL_DEX[index] || { id: 0, name: '' };
    return ({
      ...cell,
      ...pokeInfo,
    });
  }), []);

  const [pokedexMineGrid, setPokedexMineGrid] = useState(defaultGrid);
  const [progressGrid, setProgressGrid] = useState();
  const [tracker, setTracker] = useState(INITIAL_TRACKER);
  const generateMineGrids = useCallback((inputSeed) => {
    // Reset everything if not given an inputSeed
    if (!inputSeed) {
      setProgressGrid();
      setPokedexMineGrid(defaultGrid);
      setTracker(INITIAL_TRACKER);
      return;
    }

    // TODO: change this based on settings (to closest square based on columns)
    const gridLength = DEFAULT_GRID_LENGTH;
    const unshuffledMines = Array(NATIONAL_DEX.length).fill(MINE, 0, NUM_MINES).fill(0, NUM_MINES); // TODO: change 40 based on settings

    const shuffledMines = randomizeArray(unshuffledMines, inputSeed);
    const shuffledPokedex = randomizePokedex(inputSeed);
    const combinedPokedexMines = shuffledMines.map((value, index) => {
      const pokeInfo = shuffledPokedex[index] || { id: index + 1, name: '' };
      return ({
        ...pokeInfo,
        matchesSecretValue: value === MINE,
        value,
      });
    });
    const combinedGridWithBlanks = combinedPokedexMines.concat([{ ...emptyCell }, { ...emptyCell }, { ...emptyCell }, { ...emptyCell }, { ...emptyCell }]); // Because otherwise each empty cell object shares values with the rest
    const combinedGrid = convertTo2DArray(combinedGridWithBlanks, COLUMNS); // TODO: change 16 based on settings
    const numRows = combinedGrid.length;

    // Iterate through mineGrid to put proper adjacent mine numbers in the array
    for (var i = 0; i < numRows; i++) {
      for (var j = 0; j < COLUMNS; j++) {
        // if grid coord is a mine, add 1 to all non-mine adjacent grid coords
        if (combinedGrid[i][j].matchesSecretValue) {
          const isNotLeftEdgeCol = j - 1 >= 0;
          const isNotRightEdgeCol = j + 1 < COLUMNS;

          // Current Row
          if (isNotLeftEdgeCol && !combinedGrid[i][j - 1].matchesSecretValue) {
            combinedGrid[i][j - 1].value += 1;
          }
          if (isNotRightEdgeCol && !combinedGrid[i][j + 1].matchesSecretValue) {
            combinedGrid[i][j + 1].value += 1;
          }

          if (i - 1 >= 0) {
            // Previous row exists, so check through valid columns
            if (!combinedGrid[i - 1][j].matchesSecretValue) {
              combinedGrid[i - 1][j].value += 1;
            }
            if (isNotLeftEdgeCol && !combinedGrid[i - 1][j - 1].matchesSecretValue) {
              combinedGrid[i - 1][j - 1].value += 1;
            }
            if (isNotRightEdgeCol && !combinedGrid[i - 1][j + 1].matchesSecretValue) {
              combinedGrid[i - 1][j + 1].value += 1;
            }
          }

          if (i + 1 < numRows) {
            // Next row exists, so check through valid columns
            if (!combinedGrid[i + 1][j].matchesSecretValue) {
              combinedGrid[i + 1][j].value += 1;
            }
            if (isNotLeftEdgeCol && !combinedGrid[i + 1][j - 1].matchesSecretValue) {
              combinedGrid[i + 1][j - 1].value += 1;
            }
            if (isNotRightEdgeCol && !combinedGrid[i + 1][j + 1].matchesSecretValue) {
              combinedGrid[i + 1][j + 1].value += 1;
            }
          }
        }
      }
    }

    const initialProgress = Array(gridLength).fill(0);
    const progressArray = convertTo2DArray(initialProgress, COLUMNS);

    // Here we auto-mine any 0s from the cells we know are safe (the last 5)
    autoMine(progressArray, combinedGrid, numRows - 1, COLUMNS - 1);
    autoMine(progressArray, combinedGrid, numRows - 1, COLUMNS - 2);
    autoMine(progressArray, combinedGrid, numRows - 1, COLUMNS - 3);
    autoMine(progressArray, combinedGrid, numRows - 1, COLUMNS - 4);
    autoMine(progressArray, combinedGrid, numRows - 1, COLUMNS - 5);

    setPokedexMineGrid(flatten2DArray(combinedGrid));
    setProgressGrid(progressArray);
  }, []);

  const updateProgress = useCallback((selectedGrid, progressValue) => {
    const selectedIndex = convert2DIndexToIndex(selectedGrid, COLUMNS);
    const isMineExposed = progressValue === 4 && pokedexMineGrid[selectedIndex].matchesSecretValue;
    const trackerToDecrease = MAP_PROGRESS_TO_TRACKER[progressGrid[selectedIndex]];
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
      const pokedexGrid2d = convertTo2DArray(pokedexMineGrid, COLUMNS);
      const newGrid = existingGrid.slice();
      if (progressValue === 4) {
        autoMine(newGrid, pokedexGrid2d, selectedGrid.i, selectedGrid.j);
      } else {
        newGrid[selectedGrid.i][selectedGrid.j] = progressValue;
      }
      return newGrid;
    });
  }, [pokedexMineGrid, progressGrid]);

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
              onRandomize={generateMineGrids}
              onReset={generateMineGrids}
              pokedex={pokedexMineGrid}
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

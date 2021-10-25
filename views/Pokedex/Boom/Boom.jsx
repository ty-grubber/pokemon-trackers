import classnames from 'classnames/bind';
import cloneDeep from 'lodash';
import short from 'short-uuid';
import Head from 'next/head';
import React, { useState } from 'react';
import Grid from '../../../components/Grid';
import Layout from '../../../components/Layout';
import MinesweeperRow from './MinesweeperRow';
import { NATIONAL_DEX } from '../../../lib/constants/pokedex';
import { convertTo2DArray } from '../../../lib/utils';
import { randomizeArray } from '../../../lib/utils/randomize';
import styles from './Boom.module.css';

const cx = classnames.bind(styles);

const LAYOUT_TYPE = {
  random: "random",
  alphabetical: "alphabetical",
  numerical: "numerical",
};

const MINE_STATE = {
  default: "default",
  flagged: "flagged",
  revealed: "revealed",
  exploded: "exploded",
};

const DEX_STATE = {
  none: "none",
  seen: "seen",
  caught: "caught",
}

const GRID_ACTION = {
  mark_as_safe: "mark_as_safe",
  mark_as_seen: "mark_as_seen",
  mark_as_caught: "mark_as_caught",
  flag: "flag",
  reveal: "reveal",
  explode: "explode",
  reset: "reset",
};

// TODO: Make a class for the grid to organize these functions better
function generateGrid(seed, inputPokemon, layoutType, numberOfColumns, numberOfMines) {
  const pokemon = (() => {
    switch (layoutType) {
      case LAYOUT_TYPE.random: return randomizeArray(inputPokemon, seed);
      case LAYOUT_TYPE.alphabetical: return inputPokemon.sort((a, b) => a.name < b.name);
      case LAYOUT_TYPE.numerical: return inputPokemon.sort((a, b) => a.number < b.number);
    }
  })();

  const mines = Array(pokemon.length).fill(true, 0, numberOfMines).fill(false, numberOfMines);
  const gridItems = pokemon.map((pokemon, index) => {
    return {
      id: short.generate(),
      number: pokemon.id,
      name: pokemon.name,
      isMine: mines[index],
      numberOfAdjacentMines: 0,
      mineState: MINE_STATE.default,
      dexState: DEX_STATE.none,
      isSafe: false,
    };
  });

  const shuffledGridItems = randomizeArray(gridItems, seed);

  const extraGridItems = Array(numberOfColumns - shuffledGridItems.length % numberOfColumns).fill().map(() => {
    return {
      id: short.generate(),
      number: 0,
      name: "",
      isMine: false,
      numberOfAdjacentMines: 0,
      mineState: MINE_STATE.default,
      dexState: DEX_STATE.none,
      isSafe: false,
    }
  });

  const grid = convertTo2DArray(shuffledGridItems.concat(extraGridItems), numberOfColumns);

  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      grid[row][column].numberOfAdjacentMines +=
        isMine(grid, row-1, column-1) +
        isMine(grid, row-1, column) +
        isMine(grid, row-1, column+1) +
        isMine(grid, row, column-1) +
        isMine(grid, row, column+1) +
        isMine(grid, row+1, column-1) +
        isMine(grid, row+1, column) +
        isMine(grid, row+1, column+1);
    }
  }

  const lastRow = grid.length-1;
  for (let column = grid[lastRow].length-1; column >=0; column--) {
    if (grid[lastRow][column].number === 0) {
      reveal(grid, lastRow, column);
    } else {
      break;
    }
  }

  return grid;
}

function isMine(grid, row, column) {
  return grid[row] && grid[row][column] && grid[row][column].isMine ? 1 : 0
}

function getIndexOfItem(grid, item) {
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      if (grid[row][column].id === item.id) {
        return [row, column];
      }
    }
  }
}

function performActionOnItem(grid, item, action) {
  const [row, column] = getIndexOfItem(grid, item);
  const clone = _.cloneDeep(grid);
  let newItem = clone[row][column];

  switch (action) {
    case GRID_ACTION.markAsSafe:
      // TODO: Other Actions
      break;

    case GRID_ACTION.markAsSeen:
      break;

    case GRID_ACTION.markAsCaught:
      break;

    case GRID_ACTION.flag:
      if (newItem.mineState === MINE_STATE.default) {
        newItem.state = MINE_STATE.flagged;
      }

      break;

    case GRID_ACTION.reveal:
      if (newItem.mineState === MINE_STATE.default) {
        reveal(clone, row, column);
      }

      break;

    case GRID_ACTION.explode:
      break;

    case GRID_ACTION.action:
      break;
  }

  return clone;
}

function reveal(grid, row, column) {
  if (
    row >= 0 &&
    row < grid.length &&
    column >= 0 &&
    column < grid[row].length &&
    grid[row][column].mineState !== MINE_STATE.revealed &&
    grid[row][column].mineState !== MINE_STATE.exploded
  ) {
    grid[row][column].mineState = MINE_STATE.revealed

    if (
      !grid[row][column].isMine &&
      grid[row][column].numberOfAdjacentMines === 0
    ) {
      revealAround(grid, row, column)
    }
  }
}

function revealAround(grid, row, column) {
  reveal(grid, row-1, column-1);
  reveal(grid, row-1, column);
  reveal(grid, row-1, column+1);
  reveal(grid, row, column-1);
  reveal(grid, row, column+1);
  reveal(grid, row+1, column-1);
  reveal(grid, row+1, column);
  reveal(grid, row+1, column+1);
}

const initialGrid = generateGrid(short.generate(), NATIONAL_DEX, LAYOUT_TYPE.random, Math.ceil(Math.sqrt(NATIONAL_DEX.length)), 40);

export default function Boom() {
  const [grid, setGrid] = useState(initialGrid);
  const [currentAction, setCurrentAction] = useState(GRID_ACTION.reveal); // TODO: Create way of chaning the action (Maybe make right click to reveal, and a "toggle" for the left click action)
  // TODO: Add table showing stats
  // TODO: Add search
  // TODO: Create way of setting the seed (maybe let the seed be included in the url for easy sharing)

  const handleCellClick = (item) => {
    setGrid(performActionOnItem(grid, item, currentAction));
  };

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
        <Grid className={cx('trackerGrid')}>
          <Grid.Cell className={cx('pokedexContainer')}>
              {
                grid.map((row) => {
                  return <MinesweeperRow row={row} onCellClick={handleCellClick}/>
                })
              }
          </Grid.Cell>
        </Grid>
      </section>
    </Layout>
  )
}

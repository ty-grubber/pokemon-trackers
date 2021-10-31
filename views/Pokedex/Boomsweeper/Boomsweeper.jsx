import classnames from 'classnames/bind';
import cloneDeep from 'lodash';
import seedrandom from 'seedrandom';
import short from 'short-uuid';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ActionSelectionButton, { ACTION } from './ActionSelectionButton';
import Layout from '../../../components/Layout';
import MinesweeperCell, { MINE_STATE, DEX_STATE } from './MinesweeperCell';
import MinesweeperRow from './MinesweeperRow';
import PrimaryButton from './PrimaryButton';
import { LAYOUT_TYPE } from '../../../lib/constants/layout';
import { NATIONAL_DEX } from '../../../lib/constants/pokedex';
import { convertTo2DArray } from '../../../lib/utils';
import styles from './Boomsweeper.module.css';

const cx = classnames.bind(styles);

const numberOfMines = 40;

const selectableActions = [
  ACTION.mark_as_safe,
  ACTION.mark_as_seen,
  ACTION.mark_as_caught,
  ACTION.reveal,
  ACTION.explode,
  ACTION.reset,
];

function randomizeArray(arr, rng) {
  const newArr = [...arr];
  for (var i = newArr.length - 1; i > 0; i--) {
    const swapIndex = Math.floor(rng() * (i + 1));
    const currentEntry = newArr[i];
    const entryToSwap = newArr[swapIndex];
    newArr[i] = entryToSwap;
    newArr[swapIndex] = currentEntry;
  }
  return newArr;
}

// TODO: Make a class for the grid to organize these functions better
function generateGrid(seed, inputPokemon, layoutType, numberOfColumns, numberOfMines) {
  const randomNumberGenerator = seedrandom(seed);

  const pokemon = (() => {
    switch (layoutType) {
      case LAYOUT_TYPE.random: return randomizeArray(inputPokemon, randomNumberGenerator);
      case LAYOUT_TYPE.alphabetical: return inputPokemon.sort((a, b) => a.name > b.name);
      case LAYOUT_TYPE.numerical: return inputPokemon.sort((a, b) => a.number < b.number);
    }
  })();

  const mines = Array(pokemon.length).fill(true, 0, numberOfMines).fill(false, numberOfMines);
  const shuffledMines = randomizeArray(mines, randomNumberGenerator);

  const gridItems = pokemon.map((pokemon, index) => {
    return {
      id: short.generate(),
      number: pokemon.id,
      name: pokemon.name,
      isMine: shuffledMines[index],
      numberOfAdjacentMines: 0,
      mineState: MINE_STATE.default,
      dexState: DEX_STATE.none,
      wasRevealedDirectly: false,
      wasTriggeredFromExplosion: false,
    };
  });

  const extraGridItems = Array(numberOfColumns - gridItems.length % numberOfColumns).fill().map(() => {
    return {
      id: short.generate(),
      number: 0,
      name: "",
      isMine: false,
      numberOfAdjacentMines: 0,
      mineState: MINE_STATE.default,
      dexState: DEX_STATE.none,
      wasRevealedDirectly: false,
      wasTriggeredFromExplosion: false,
    }
  });

  const grid = convertTo2DArray(gridItems.concat(extraGridItems), numberOfColumns);

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
    case ACTION.mark_as_safe:
      if (newItem.mineState === MINE_STATE.default) {
        newItem.mineState = MINE_STATE.marked_as_safe;
      }

      break;

    case ACTION.mark_as_seen:
      if (newItem.dexState !== DEX_STATE.caught) {
        newItem.dexState = DEX_STATE.seen;
      }

      break;

    case ACTION.mark_as_caught:
      newItem.dexState = DEX_STATE.caught;
      break;

    case ACTION.flag:
      if (newItem.mineState === MINE_STATE.default || newItem.mineState === MINE_STATE.marked_as_safe) {
        newItem.mineState = MINE_STATE.flagged;
      }

      break;

    case ACTION.reveal:
      if (
        newItem.dexState === DEX_STATE.caught && (
          newItem.mineState === MINE_STATE.default ||
          newItem.mineState === MINE_STATE.marked_as_safe
        )
      ) {
        reveal(clone, row, column, false, true);
      }

      break;

    case ACTION.explode:
      explode(clone, row, column);
      break;

    case ACTION.reset:
      newItem.mineState = MINE_STATE.default;
      newItem.dexState = DEX_STATE.none;
      newItem.wasRevealedDirectly = false;
      newItem.wasTriggeredFromExplosion = false;
      break;
  }

  return clone;
}

function explode(grid, row, column) {
  grid[row][column].mineState = MINE_STATE.exploded;
  reveal(grid, row-1, column-1, true);
  reveal(grid, row-1, column, true);
  reveal(grid, row-1, column+1, true);
  reveal(grid, row, column-1, true);
  reveal(grid, row, column+1, true);
  reveal(grid, row+1, column-1, true);
  reveal(grid, row+1, column, true);
  reveal(grid, row+1, column+1, true);
}

function reveal(grid, row, column, fromExplosion = false, direct = false) {
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
      (direct && grid[row][column].isMine) ||
      grid[row][column].numberOfAdjacentMines === 0
    ) {
      revealAround(grid, row, column)
    }

    if (fromExplosion) {
      grid[row][column].wasTriggeredFromExplosion = true
    }

    if (direct) {
      grid[row][column].wasRevealedDirectly = true
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

function numberOfItemsWhere(grid, condition) {
  return grid.flat().reduce((number, item) => {
    return number + (condition(item) ? 1 : 0)
  }, 0);
}

export default function Boom({
  seed,
  layoutType,
}) {
  const [grid, setGrid] = useState([]);
  const [currentClickAction, setCurrentClickAction] = useState();
  const [searchTerm, setSearchTerm] = useState();
  const [isShowingNewGridModal, setIsShowingNewGridModal] = useState();

  useEffect(() => {
    setGrid(generateGrid(
      seed,
      NATIONAL_DEX,
      layoutType,
      Math.ceil(Math.sqrt(NATIONAL_DEX.length)),
      numberOfMines
    ));

    setCurrentClickAction(ACTION.mark_as_safe);
    setSearchTerm('');
    setIsShowingNewGridModal(false);
  }, [seed, layoutType]);

  const cellClickAction = (item) => {
    setSearchTerm('');
    setGrid(performActionOnItem(grid, item, currentClickAction));
  };

  const cellRightClickAction = (item) => {
    setSearchTerm('');
    setGrid(performActionOnItem(grid, item, ACTION.flag));
  };

  const pokemonLayoutName = (() => {
    switch (layoutType) {
      case LAYOUT_TYPE.numerical: return 'Numerical';
      case LAYOUT_TYPE.alphabetical: return 'Alphabetical';
      case LAYOUT_TYPE.random: return 'Randomized';
    }
  })();

  const copyLinkAction = useCallback(() => {
    navigator.clipboard.writeText(window.location);
  }, []);

  const showNewGridModalAction = useCallback(() => {
    setIsShowingNewGridModal(true);
  }, []);

  const numberOfFlags = numberOfItemsWhere(grid, (item) => {
    return item.mineState === MINE_STATE.flagged
  });

  const numberOfMinesRevealed = numberOfItemsWhere(grid, (item) => {
    return item.isMine && (item.mineState === MINE_STATE.revealed || item.mineState === MINE_STATE.exploded)
  });

  const numberOfMinesRemaining = numberOfMines - numberOfFlags - numberOfMinesRevealed;

  const numberOfPokemonCaught = numberOfItemsWhere(grid, (item) => {
    return item.dexState === DEX_STATE.caught
  });

  const numberOfPokemonSeen = numberOfPokemonCaught + numberOfItemsWhere(grid, (item) => {
    return item.dexState === DEX_STATE.seen
  });

  const numberOfMistakes = numberOfItemsWhere(grid, (item) => {
    return item.mineState === MINE_STATE.revealed && item.isMine && item.wasRevealedDirectly
  });

  const numberOfMinesRevelesByMistake = numberOfItemsWhere(grid, (item) => {
    return item.isMine && !item.wasTriggeredFromExplosion && item.mineState === MINE_STATE.revealed
  });

  const numberOfExplosions = numberOfItemsWhere(grid, (item) => {
    return item.mineState === MINE_STATE.exploded
  });

  const numberOfMinesExploded = numberOfItemsWhere(grid, (item) => {
    return item.isMine && item.mineState === MINE_STATE.exploded
  });

  const numberOfMinesRevealedAroundExplosions = numberOfItemsWhere(grid, (item) => {
    return item.isMine && item.wasTriggeredFromExplosion && item.mineState === MINE_STATE.revealed
  });

  const numberOfMinesRevealedByExplosions = numberOfMinesExploded + numberOfMinesRevealedAroundExplosions;

  const timePenaltyInMinutes = numberOfMinesRevelesByMistake * 15 + numberOfExplosions * 5 + numberOfMinesRevealedAroundExplosions * 5;

  const searchInputRef = useRef();

  const isShowingNewGridModalRef = useRef();
  isShowingNewGridModalRef.current = isShowingNewGridModal;

  const documentKeyDownListener = useCallback((e) => {
    if (isShowingNewGridModalRef.current) {
      return;
    }

    const keyCode = e.which || e.keyCode;
    const inputsAreBlurred = document.activeElement !== searchInputRef.current;

    // valid keys are letters, numbers, dash, apostrophe or period;
    const validKeyPressed = (keyCode >= 48 && keyCode <= 90) || keyCode === 222 || keyCode === 189 || keyCode === 190;

    if (inputsAreBlurred && validKeyPressed) {
      searchInputRef.current.focus();
    } else if (keyCode === 27) { // Escape
      setSearchTerm('');
      searchInputRef.current.blur();
    }
  }, []);

  useEffect(() => {
    if (document && searchInputRef.current) {
      document.addEventListener('keydown', documentKeyDownListener);
    }
  }, []);

  const handleSearchChange = useCallback(({ target }) => {
    setSearchTerm(target.value.toLowerCase());
  }, []);

  const newGridModalLayoutSelectorRef = useRef();
  const newGridModalSeedInputRef = useRef();

  const newGridModalCancelAction = useCallback(() => {
    setIsShowingNewGridModal(false);
  }, []);

  const router = useRouter();

  const newGridModalCreateAction = useCallback(() => {
    const seed = newGridModalSeedInputRef.current.value === '' ? short.generate() : newGridModalSeedInputRef.current.value;
    const layoutType = newGridModalLayoutSelectorRef.current.value
    let href = '/pokedex/boom?seed=' + seed;

    if (layoutType !== LAYOUT_TYPE.random) {
      href += '&layout=' + layoutType;
    }

    router.push(href);
  }, []);

  return <div>
    <Layout>
      <Head>
        <title>Pokédex Minesweeper</title>
        <meta
          name="description"
          content="Play Minesweeper using the pokedex as the mining grid"
        />
        <meta name="og:title" content="Pokedex Minesweeper" />
      </Head>
      <section
        style={{
          display: 'flex',
          alignItems: 'start',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <header className={cx('header')}>
            <h1>Pokédex Minesweeper</h1>
          </header>
          <div>
            <div>
              {
                grid.map((row) => {
                  return <MinesweeperRow
                    row={row}
                    cellClickAction={cellClickAction}
                    cellRightClickAction={cellRightClickAction}
                    searchTerm={searchTerm}
                  />
                })
              }
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '5px',
                margin: '20px',
              }}
            >
              {
                selectableActions.map((action) => {
                  return <ActionSelectionButton
                    action={action}
                    currentAction={currentClickAction}
                    clickAction={() => { setCurrentClickAction(action); }}
                  />
                })
              }
            </div>
          </div>
        </div>
        <div className={cx('sidebar')}>
          <section className={cx('sidebarSection')}>
            <header className={cx('header')}>
              <h1>Stats</h1>
            </header>
            <table>
              <div>
                <div>Flags Placed:</div>
                <div>{numberOfFlags}</div>
              </div>
              <div>
                <div>Mines Remaining:</div>
                <div>{numberOfMinesRemaining}</div>
              </div>
              <div>
                <div>Pokémon Seen:</div>
                <div>{numberOfPokemonSeen}</div>
              </div>
              <div>
                <div>Pokémon Caught:</div>
                <div>{numberOfPokemonCaught}</div>
              </div>
              <div>
                <div>Mistakes:</div>
                <div>{numberOfMistakes}</div>
              </div>
              <div>
                <div>Mines Revealed By Mistake:</div>
                <div>{numberOfMinesRevelesByMistake}</div>
              </div>
              <div>
                <div>In Game Explosions:</div>
                <div>{numberOfExplosions}</div>
              </div>
              <div>
                <div>Mines Revealed By In Game Explosions:</div>
                <div>{numberOfMinesRevealedByExplosions}</div>
              </div>
              <div>
                <div>Time Penalty:</div>
                <div>{timePenaltyInMinutes} min.</div>
              </div>
            </table>
          </section>
          <section className={cx('sidebarSection')}>
            <header className={cx('header')}>
              <h1>Search</h1>
            </header>
            <input
              id="searchInput"
              ref={searchInputRef}
              onChange={handleSearchChange}
              spellCheck="false"
              value={searchTerm}
              style={{
                width:'300px',
                textAlign: 'center',
                fontSize: 20,
                borderRadius: '20px'
              }}
            />
            <div
              style={{
                color: 'darkGray',
                fontSize: 12,
                textAlign: 'center',
              }}
            >
              Type anywhere to search - Press escape to clear
            </div>
          </section>
          <section className={cx('sidebarSection')}>
            <header className={cx('header')}>
              <h1>Info</h1>
            </header>
            <table>
              <div>
                <div>Pokémon Layout:</div>
                <div>{pokemonLayoutName}</div>
              </div>
              <div>
                <div>Seed:</div>
                <div>{seed}</div>
              </div>
            </table>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                gap: '10px',
                width: '100%',
              }}
            >
              <PrimaryButton
                title={'Copy Link'}
                onClick={copyLinkAction}
              />
              <PrimaryButton
                title={'New Grid'}
                onClick={showNewGridModalAction}
              />
            </div>
          </section>
          <section className={cx('sidebarSection')}>
            <header className={cx('header')}>
              <h1>About</h1>
            </header>
            <p>
              Play Minesweeper and Pokémon together.
            </p>
            <p>
              Forty mines have been hidden in this Pokémon grid.
              Flag or reveal all the mines to finish the game.
            </p>
            <p>
              Reveal Pokémon that you've caught in game to help learn where the mines may be.
              Be careful not to reveal any mines though.
              If a mine is revealed by mistake it will explode and reveal each surrouding Pokémon.
              Each mine revealed this way is a 15 minute penalty.
            </p>
            <p>
              If a Pokémon uses Explosion or Selfdestruct in game, explode it in the grid.
              This will reveal each surrounding Pokémon.
              The Pokémon that exploded and each mine revealed in in this way is a 5 minute penalty.
            </p>
            <p>
              Right click on a Pokémon to flag it as a suspected mine.
            </p>
            <p>
              Select an action from below the grid and left click on a Pokémon to perform that action on that pokemon.
            </p>
          </section>
        </div>
      </section>
    </Layout>
    <div
      style={{
        display: isShowingNewGridModal ? 'block' : 'none',
        position: 'absolute',
        backgroundColor: '#000000A0',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          borderRadius: '20px',
          top: '100px',
          left: '50%',
          transform: 'translate(-50%)',
          minWidth: '500px',
          padding: '50px',
          boxShadow: '5px 5px 10px 5px #00000050',
        }}
      >
        <header className={cx('header')}>
          <h1>Create a New Grid</h1>
        </header>
        <table
          className={cx('modalForm')}
          style={{
            textAlign: 'left',
            borderSpacing: '10px',
            paddingTop: '20px',
            paddingBottom: '30px',
          }}
        >
          <tr>
            <th>Pokémon Grid Layout: </th>
            <td>
              <select name="layoutType" id="layoutType" ref={newGridModalLayoutSelectorRef}>
                <option value={LAYOUT_TYPE.random}>Randomized</option>
                <option value={LAYOUT_TYPE.numerical}>Numerical</option>
                <option value={LAYOUT_TYPE.alphabetical}>Alphabetical</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>Seed: </th>
            <td>
              <input
                id="seedInput"
                spellCheck="false"
                placeholder="Leave blank for random seed."
                ref={newGridModalSeedInputRef}
              />
            </td>
          </tr>
        </table>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'space-around',
          }}
        >
        <PrimaryButton
          title={'Cancel'}
          onClick={newGridModalCancelAction}
          style={{
            maxWidth: '200px',
          }}
        />
        <PrimaryButton
          title={'Create'}
          onClick={newGridModalCreateAction}
          style={{
            maxWidth: '200px',
          }}
        />
        </div>
      </div>
    </div>
  </div>
}

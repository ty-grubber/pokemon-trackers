import { css } from '@emotion/react';
import classnames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import short from 'short-uuid';
import { NATIONAL_DEX } from '../../lib/constants/pokedex';
import { debounce, noop } from '../../lib/utils';
import { convertIndexTo2DIndex } from '../../lib/utils/arrayConversion';
import Grid from '../Grid';
import styles from './PokedexGrid.module.css';

const cx = classnames.bind(styles);

export default function PokedexGrid({
  columns,
  defaultClickValue, // TODO: this should maybe be based off the hiddenProgressGrid instead...
  hiddenProgressGrid,
  onCellClick,
  onRandomize,
  onReset,
  pokedex,
  selectedPokeOptions,
  trackClicks,
}) {
  const [pokemonClickValues, setPokemonClickValues] = useState(Array(NATIONAL_DEX.length + 1).fill(defaultClickValue));
  const [activeSeed, setActiveSeed] = useState('');
  const [inputSeed, setInputSeed] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState();
  const [selectedGrid, setSelectedGrid] = useState();
  const searchInputRef = useRef();
  const seedInputRef = useRef();

  const documentKeyDownListener = useCallback((e) => {
    const keyCode = e.which || e.keyCode;
    const inputsAreBlurred = document.activeElement !== searchInputRef.current && document.activeElement !== seedInputRef.current;
    // valid keys are letters, numbers, dash, apostrophe or period;
    const validKeyPressed = (keyCode >= 48 && keyCode <= 90) || keyCode === 222 || keyCode === 189 || keyCode === 190;
    if (inputsAreBlurred && validKeyPressed) {
      searchInputRef.current.focus();
    } else if (keyCode === 27) {
      searchInputRef.current.value = '';
      searchInputRef.current.blur();
      seedInputRef.current.blur();
      setSearchTerm('');
    }
  }, []);

  useEffect(() => {
    if (document && searchInputRef.current) {
      document.addEventListener('keydown', documentKeyDownListener);
    }
  }, [documentKeyDownListener]);

  const updateStateSeed = debounce(value => setInputSeed(value), 1000);

  const handleSeedChange = useCallback(({ target }) => {
    updateStateSeed(target.value);
  }, [updateStateSeed]);

  const handleRandomize = useCallback((e) => {
    e.preventDefault();
    const checkSeed = inputSeed || short.generate();
    if (checkSeed !== activeSeed) {
      setActiveSeed(checkSeed);
      setInputSeed(checkSeed);
      onRandomize(checkSeed);
    }
  }, [activeSeed, inputSeed, onRandomize]);

  const handleReset = useCallback((e) => {
    e.preventDefault();
    setActiveSeed('');
    setInputSeed('');
    onReset();
  }, [onReset]);

  const updateStateSearchTerm = debounce(value => setSearchTerm(value.toLowerCase()), 250);

  const handleSearchChange = useCallback(({ target }) => {
    updateStateSearchTerm(target.value);
  }, [updateStateSearchTerm]);

  const createLeftClickHandler = useCallback(selectedPoke => (newValue, oldValue) => {
    const ddIndex = convertIndexTo2DIndex(selectedPoke.index, columns);
    if (hiddenProgressGrid && !['X', 5].includes(hiddenProgressGrid[ddIndex.i][ddIndex.j])) {
      setSelectedPokemon(pokedex.find(poke => poke.id === selectedPoke.id));
      setSelectedGrid(ddIndex);
    }
    onCellClick(newValue, oldValue);
  }, [columns, hiddenProgressGrid, onCellClick, pokedex]);

  const handleRightClick = useCallback((newValue, oldValue) => {
    setSelectedPokemon(undefined);
    setSelectedGrid(undefined);
    onCellClick(newValue, oldValue);
  }, [onCellClick]);

  const createActionClickHandler = useCallback((action, clearSelected, clickValue) => () => {
    setPokemonClickValues(existingClickValues => {
      const newClickValues = [...existingClickValues];
      newClickValues[selectedPokemon.id] = clickValue;
      return newClickValues;
    });
    if (typeof action === 'function') {
      action(selectedGrid, clickValue);
      if (clearSelected) {
        setSelectedPokemon(undefined);
      }
    }
  }, [selectedGrid, selectedPokemon]);

  const gridStyles = css`
    max-width: ${columns > 16 ? 800 : 670 - (40 * (16 - columns))}px;
`

  const bgColors = useMemo(() => (
    selectedPokeOptions && selectedPokeOptions.length > 0
      ? selectedPokeOptions.map(option => option.color)
      : ['darkgoldenrod', 'dodgerblue', 'white', 'red', 'purple']
  ), [selectedPokeOptions]);

  return (
    <>
      <Grid className={cx('pokedexGrid')} css={gridStyles} columns={columns}>
        {pokedex.map(({ id, matchesSecretValue, name, value }, index) => {
          let cellContent = (
            <img
              alt={name}
              height={40}
              src={`/images/pokemon/${id}.png`}
              title={name}
              width={40}
            />
          );
          if (hiddenProgressGrid && typeof value !== 'undefined') {
            const ddIndex = convertIndexTo2DIndex(index, columns);
            if (hiddenProgressGrid[ddIndex.i][ddIndex.j] === 'X') {
              if (id === 0) {
                cellContent = (
                  <div className={cx('bgPokemon', 'emptyCell')}>
                    <p className={cx('hiddenValue')} title="Empty spot">
                      {value}
                    </p>
                  </div>
                );
              } else {
                cellContent = (
                  <div className={cx('bgPokemon', { matchesSecretValue })}>
                    <img
                      alt={name}
                      className={cx('bgPokemonImg')}
                      height={40}
                      src={`/images/pokemon/${id}.png`}
                      title={name}
                      width={40}
                    />
                    <p className={cx('hiddenValue')} title={name}>
                      {value}
                    </p>
                  </div>
                );
              }
            }
          }
          return (
            <Grid.Cell
              key={id || `Empty ${index}`}
              bgColors={bgColors}
              defaultClickValue={pokemonClickValues[id]}
              matchesSearch={!searchTerm || name.toLowerCase().includes(searchTerm)}
              maxHeight="40px"
              onLeftClick={createLeftClickHandler({ id, index })}
              onRightClick={handleRightClick}
              trackClicks={trackClicks}
            >
              {cellContent}
            </Grid.Cell>
          );
        })}
      </Grid>
      {!!selectedPokeOptions && selectedPokeOptions.length > 0 && (
        <div className={cx('pokeOptionsContainer')}>
          {selectedPokemon ? (
            <>
              <span className={cx('inputLabel')}>
                {selectedPokemon.name} Actions:
              </span>
              {selectedPokeOptions.map(({action, clearSelected, clickValue, color, text, textColor}) => (
                <button
                  key={text}
                  className={cx('clickOptionButton')}
                  onClick={createActionClickHandler(action, clearSelected, clickValue)}
                  style={{ backgroundColor: color, color: `${textColor || 'white'}`}}
                  type='button'
                >
                  {text}
                </button>
              ))}
            </>
          ) : (
            <span className={cx('inputLabel')}>Click a pokemon to see marking actions</span>
          )}
        </div>
      )}
      <br />
      <div className={cx('randomizerContainer')}>
        <input
          id="seedInput"
          ref={seedInputRef}
          className={cx('seedInput')}
          maxLength="22"
          onChange={handleSeedChange}
          spellCheck="false"
        />
        <button className={cx('randomizerButton')} onClick={handleRandomize} type="button">
          Randomize
        </button>
        <button className={cx('resetButton')} onClick={handleReset} type="button">
          Reset
        </button>
        <br />
        <span className={cx('hintText')}>Leave blank for random seed</span>
      </div>
      <div className={cx('searchContainer')}>
        <label htmlFor="searchInput" className={cx('inputLabel')}>Grid Search: </label>
        <input
          id="searchInput"
          ref={searchInputRef}
          className={cx('searchInput')}
          maxLength="15"
          onChange={handleSearchChange}
          spellCheck="false"
        />
        <br />
        <span className={cx('hintText')}>Press escape to auto-clear</span>
      </div>
    </>
  )
}

PokedexGrid.propTypes = {
  columns: PropTypes.number,
  defaultClickValue: PropTypes.number,
  hiddenProgressGrid: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))),
  onCellClick: PropTypes.func,
  onRandomize: PropTypes.func,
  onReset: PropTypes.func,
  pokedex: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    // Used to trigger a background change on the grid cell to indicate grid has special value
    matchesSecretValue: PropTypes.bool,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  })),
  selectedPokeOptions: PropTypes.arrayOf(PropTypes.shape({
    clickValue: PropTypes.number.isRequired,
    color: PropTypes.string,
    text: PropTypes.string.isRequired,
    textColor: PropTypes.string,
  })),
  trackClicks: PropTypes.bool,
}

PokedexGrid.defaultProps = {
  columns: 20,
  defaultClickValue: 0,
  hiddenProgressGrid: undefined,
  onCellClick: noop,
  onRandomize: noop,
  onReset: noop,
  pokedex: NATIONAL_DEX,
  selectedPokeOptions: undefined,
  trackClicks: false,
}

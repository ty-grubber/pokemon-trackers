import classnames from 'classnames/bind';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import short from 'short-uuid';
import { NATIONAL_DEX } from '../../lib/constants/pokedex';
import { randomizePokedex } from '../../lib/utils/randomize';
import Grid from '../Grid';
import styles from './PokedexGrid.module.css';

const cx = classnames.bind(styles);

export default function PokedexGrid({ onCellClick }) {
  const [orderedPokedex, setOrderedPokedex] = useState(NATIONAL_DEX);
  const [activeSeed, setActiveSeed] = useState('');
  const [inputSeed, setInputSeed] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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
      setSearchTerm('');
      searchInputRef.current.blur();
    }
  }, []);

  useEffect(() => {
    if (document && searchInputRef.current) {
      document.addEventListener('keydown', documentKeyDownListener);
    }
  }, [documentKeyDownListener]);

  const handleSeedChange = useCallback(({ target }) => {
    setInputSeed(target.value);
  }, []);

  const handleRandomize = useCallback((e) => {
    e.preventDefault();
    const checkSeed = inputSeed || short.generate();
    if (checkSeed !== activeSeed) {
      setOrderedPokedex(randomizePokedex(checkSeed));
      setActiveSeed(checkSeed);
      setInputSeed(checkSeed);
    }
  }, [activeSeed, inputSeed]);

  const handleReset = useCallback((e) => {
    e.preventDefault();
    setOrderedPokedex(NATIONAL_DEX);
    setActiveSeed('');
    setInputSeed('');
  }, []);

  const handleSearchChange = useCallback(({ target }) => {
    setSearchTerm(target.value.toLowerCase());
  }, []);

  return (
    <div className={cx('pokedexGrid')}>
      <Grid columns={20}>
        {orderedPokedex.map(({ id, name }) => (
          <Grid.Cell
            key={id}
            matchesSearch={!searchTerm || name.toLowerCase().includes(searchTerm)}
            maxHeight="40px"
            onLeftClick={onCellClick}
            onRightClick={onCellClick}
            trackClicks
          >
            <Image
              alt={`${name}`}
              height={40}
              priority
              src={`/images/pokemon/${id}.png`}
              title={`${name}`}
              width={40}
              />
          </Grid.Cell>
        ))}
      </Grid>
      <br />
      <div className={cx('randomizerContainer')}>
        <input
          id="seedInput"
          ref={seedInputRef}
          className={cx('seedInput')}
          maxLength="22"
          onChange={handleSeedChange}
          spellCheck="false"
          value={inputSeed}
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
          value={searchTerm}
        />
        <br />
        <span className={cx('hintText')}>Press escape to auto-clear</span>
      </div>
    </div>
  )
}

PokedexGrid.propTypes = {
  onCellClick: PropTypes.func,
}

PokedexGrid.defaultProps = {
  onCellClick: () => { },
}

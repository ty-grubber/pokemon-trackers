import classnames from 'classnames/bind';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
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
  })

  return (
    <>
      <Grid className={cx('pokedexGrid')} columns={20}>
        {orderedPokedex.map(({ id, name }) => (
          <Grid.Cell
            key={id}
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
      <div className={cx('randomizerContainer')}>
        <input id="seedInput" className={cx('seedInput')} onChange={handleSeedChange} value={inputSeed} maxLength="22" />
        <button className={cx('randomizerButton')} onClick={handleRandomize} type="button">
          Randomize
        </button>
        <button className={cx('resetButton')} onClick={handleReset} type="button">
          Reset
        </button>
        <br />
        <span className={cx('randomizerHint')}>Leave blank for random seed</span>
      </div>
    </>
  )
}

PokedexGrid.propTypes = {
  onCellClick: PropTypes.func,
}

PokedexGrid.defaultProps = {
  onCellClick: () => { },
}

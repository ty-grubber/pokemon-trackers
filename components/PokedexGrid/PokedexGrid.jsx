import classnames from 'classnames/bind';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '../Grid';
import { NATIONAL_DEX } from '../../lib/constants/pokedex.js';
import styles from './PokedexGrid.module.css';

const cx = classnames.bind(styles);

export default function PokedexGrid({ onCellClick }) {
  return (
    <>
      <Grid className={cx('pokedexGrid')} columns={20}>
        {NATIONAL_DEX.map(({ id, name }) => (
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
        <input id="seedInput" />
        <button className={cx('randomizerButton')}>
          Randomize
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

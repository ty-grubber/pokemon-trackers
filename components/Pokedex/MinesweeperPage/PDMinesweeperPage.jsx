import classnames from 'classnames/bind';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import Layout from '../../Layout';
import { GEN2 } from '../../../lib/constants/pokedex.js';
import Grid from '../../Grid';
import UnderConstruction from '../../UnderConstruction';
import styles from './PDMinesweeperPage.module.css';

const cx = classnames.bind(styles);

export default function Minesweeper() {
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
        <UnderConstruction />

        <Grid className={cx('pokedexGrid')} columns={4}>
          {GEN2.map(pokemon => (
            <Grid.Cell key={pokemon.id}>
              <Image
                alt={`${pokemon.name}`}
                src={`https://img.pokemondb.net/sprites/gold/normal/${pokemon.name.toLowerCase()}.png`}
                width={25}
                height={25}
                />
            </Grid.Cell>
          ))}
        </Grid>
      </section>
    </Layout>
  )
}

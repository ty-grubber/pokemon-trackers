import classnames from 'classnames/bind';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import Layout from '../../Layout';
import { NATIONAL_DEX } from '../../../lib/constants/pokedex.js';
import Grid from '../../Grid';
import UnderConstruction from '../../UnderConstruction';
import styles from './BasicTrackerPage.module.css';

const cx = classnames.bind(styles);

export default function BasicTracker() {
  return (
    <Layout>
      <Head>
        <title>Pokedex Tracker</title>
        <meta
          name="description"
          content="Track pokemon in the pokedex using this tracker"
        />
        <meta name="og:title" content="Pokedex Simple Tracker" />
      </Head>

      <header className={cx('header')}>
        <h1>Pokedex Tracker</h1>
      </header>
      <section>
        <UnderConstruction />

        <Grid className={cx('pokedexGrid')} columns={20}>
          {NATIONAL_DEX.map(({ id, name }) => (
            <Grid.Cell
              key={id}
            >
              <Image
                alt={`${name}`}
                height={50}
                priority
                src={`/images/pokemon/${id}.png`}
                title={`${name}`}
                width={50}
                />
            </Grid.Cell>
          ))}
        </Grid>
      </section>
    </Layout>
  )
}

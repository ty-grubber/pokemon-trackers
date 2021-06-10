import classnames from 'classnames/bind';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import Layout from '../../Layout';
import { NATIONAL_DEX } from '../../../lib/constants/pokedex.js';
import Grid from '../../Grid';
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
      <section>
        <Grid className={cx('trackerGrid')} columns={2}>
          <Grid.Cell className={cx('pokedexContainer')}>
            <Grid className={cx('pokedexGrid')} columns={20}>
              {NATIONAL_DEX.map(({ id, name }) => (
                <Grid.Cell
                  key={id}
                  maxHeight="40px"
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
          </Grid.Cell>
          <Grid.Cell className={cx('trackerContainer')}>
            <header className={cx('header')}>
              <h1>Pokedex Tracker</h1>
            </header>
            <div className={cx('countContainer')}>
              <b>Total Caught: </b> 0<br />
              <b>Total Tracked: </b> 0<br />
              <b>Total Untracked: </b> 0<br />
            </div>
          </Grid.Cell>
        </Grid>
      </section>
    </Layout>
  )
}

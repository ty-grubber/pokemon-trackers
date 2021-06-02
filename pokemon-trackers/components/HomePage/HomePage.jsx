import classnames from 'classnames/bind';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layout';
import utilStyles from '../../styles/utils.module.css';
import styles from './HomePage.module.css';

const ucx = classnames.bind(utilStyles);
const cx = classnames.bind(styles);

export default function HomePage() {
  return (
    <Layout home>
      <Head>
        <title>Pokedex Trackers Home</title>
        <meta
          name="description"
          content="Keep track of everything you need for your pokemon randomizers"
        />
        <meta name="og:title" content="Pokemon Trackers" />
      </Head>
      <header className={cx('header')}>
        <Image
          priority
          src="/images/tiger-sigil.jpg"
          className={ucx('borderCircle')}
          width={75}
          height={100}
          alt="Tiger Image"
        />
        <h1 className={ucx('heading2Xl')}>Pokemon Trackers</h1>
      </header>
      <section className={ucx('headingMd')}>
        <h1>Pokedex Trackers</h1>
        <Link href="/pokedex/minesweeper">
          <a>Minesweeper</a>
        </Link>
      </section>
    </Layout>
  )
}

import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout';
import utilStyles from '../styles/utils.module.css';

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>Pokedex Trackers Home</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <h1>Pokedex Trackers</h1>
        <Link href="/pokedex/minesweeper">
          <a>Minesweeper</a>
        </Link>
      </section>
    </Layout>
  )
}

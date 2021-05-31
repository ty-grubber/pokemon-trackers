import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function Minesweeper() {
  return (
    <Layout>
      <Head>
        <title>Pokedex Minesweeper</title>
      </Head>
      <h1>Minesweeper</h1>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
    </Layout>
  )
}

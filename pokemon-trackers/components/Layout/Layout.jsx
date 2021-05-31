import classnames from 'classnames/bind';
import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../../styles/utils.module.css';
import Link from 'next/link';

const cx = classnames.bind(styles);
const ucx = classnames.bind(utilStyles);

export default function Layout({ children, home }) {
  return (
    <div className={cx('container')}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Keep track of everything you need for your pokemon randomizers"
        />
        <meta name="og:title" content="Pokedex Trackers" />
      </Head>
      <header className={cx('header')}>
        {home ? (
          <>
            <Image
              priority
              src="/images/tiger-sigil.jpg"
              className={ucx('borderCircle')}
              height={144}
              width={144}
              alt="Tiger Image"
            />
            <h1 className={ucx('heading2Xl')}>Pokedex Trackers</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                <Image
                  priority
                  src="/images/tiger-sigil.jpg"
                  className={ucx('borderCircle')}
                  height={108}
                  width={108}
                  alt="Tiger Image"
                />
              </a>
            </Link>
            <h2 className={ucx('headingLg')}>
              <Link href="/">
                <a className={ucx('colorInherit')}>Home</a>
              </Link>
            </h2>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={cx('backToHome')}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  )
}

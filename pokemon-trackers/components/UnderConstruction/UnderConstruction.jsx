import classnames from 'classnames/bind';
import React from 'react';
import styles from './UnderConstruction.module.css';

const cx = classnames.bind(styles);

export default function UnderConstruction() {
  return <p className={cx('construction')}>&#128119; Under Construction! &#128679;</p>
}

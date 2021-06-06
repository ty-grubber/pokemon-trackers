import classnames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './Grid.module.css';

const cx = classnames.bind(styles);

export default function Grid({ className, columns }) {
  return (
    <div className={cx('gridContainer', className)}>
      {React.Children.map(child => (
        <div key={child.key} className={cx('gridChild')} style={{ width: `calc(100% / ${columns})` }}>
          {child}
        </div>
      ))}
    </div>
  );
}

Grid.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.number.isRequired,
}

Grid.defaultProps = {
  className: undefined,
}

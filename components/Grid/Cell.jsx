import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';

export default function Cell({ className, ...rest }) {
  const cellStyles = css`
    flex-grow: 1;
`
  return (
    <div css={cellStyles} className={className} {...rest} />
  );
}

Cell.propTypes = {
  className: PropTypes.string,
}

Cell.defaultProps = {
  className: undefined,
}

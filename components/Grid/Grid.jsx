import PropTypes from 'prop-types';
import React from 'react';
import Cell from './Cell';
import { css } from '@emotion/react';

function Grid({ className, columns, ...rest }) {
  const gridContainerStyles = css`
    display: flex;
    flex-wrap: wrap;

    & > * {
      width: calc(100% / ${columns});
    }
`

  return (
    <div css={gridContainerStyles} className={className} {...rest} />
  );
}

Grid.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.number.isRequired,
}

Grid.defaultProps = {
  className: undefined,
}

const DexGrid = React.memo(Grid);

DexGrid.Cell = Cell;

export default DexGrid;

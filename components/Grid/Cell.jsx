import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

const bgColors = [
  '#0f0',
  '#00f',
  '#fff',
  '#000',
  '#f00',
];

export default function Cell({
  className,
  maxHeight,
  onLeftClick,
  onRightClick,
  ...rest
}) {
  const [clickValue, setClickValue] = useState(2);
  const cellStyles = css`
    background-color: ${bgColors[clickValue]};
    max-height: ${maxHeight}px;
    flex-grow: 1;
`
  const handleClick = useCallback((e) => {
    setClickValue(clickValue => Math.min(clickValue + 1, bgColors.length - 1));
    onLeftClick(e);
  }, []);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    setClickValue(clickValue => Math.max(clickValue - 1, 0));
    onRightClick(e);
  }, [])

  return (
    <div css={cellStyles} className={className} onClick={handleClick} onContextMenu={handleContextMenu} {...rest} />
  );
}

Cell.propTypes = {
  className: PropTypes.string,
  maxHeight: PropTypes.number,
  onLeftClick: PropTypes.func,
  onRightClick: PropTypes.func,
}

Cell.defaultProps = {
  className: undefined,
  maxHeight: 50,
  onLeftClick: () => { },
  onRightClick: () => { },
}

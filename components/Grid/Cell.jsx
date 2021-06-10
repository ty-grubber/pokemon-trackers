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
  trackClicks,
  ...rest
}) {
  const [clickValue, setClickValue] = useState(2);
  const cellStyles = css`
    background-color: ${bgColors[clickValue]};
    max-height: ${maxHeight};
    flex-grow: 1;
`
  const handleClick = useCallback((e) => {
    if (trackClicks) {
      setClickValue(clickValue => Math.min(clickValue + 1, bgColors.length - 1));
      onLeftClick(e);
    }
  }, []);

  const handleContextMenu = useCallback((e) => {
    if (trackClicks) {
      e.preventDefault();
      setClickValue(clickValue => Math.max(clickValue - 1, 0));
      onRightClick(e);
    }
  }, [])

  return (
    <div css={cellStyles} className={className} onClick={handleClick} onContextMenu={handleContextMenu} {...rest} />
  );
}

Cell.propTypes = {
  className: PropTypes.string,
  maxHeight: PropTypes.string,
  onLeftClick: PropTypes.func,
  onRightClick: PropTypes.func,
  trackClicks: PropTypes.bool,
}

Cell.defaultProps = {
  className: undefined,
  maxHeight: 'auto',
  onLeftClick: () => { },
  onRightClick: () => { },
  trackClicks: false,
}

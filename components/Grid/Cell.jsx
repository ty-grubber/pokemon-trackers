import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

export default function Cell({
  bgColors,
  className,
  defaultClickValue,
  maxHeight,
  onLeftClick,
  onRightClick,
  trackClicks,
  ...rest
}) {
  const [clickValue, setClickValue] = useState(defaultClickValue);
  const cellStyles = css`
    background-color: ${bgColors[clickValue]};
    max-height: ${maxHeight};
    flex-grow: 1;
`
  const handleClick = useCallback(() => {
    if (trackClicks) {
      setClickValue(currentValue => {
        const newValue = Math.min(currentValue + 1, bgColors.length - 1);
        onLeftClick(newValue, currentValue);
        return newValue;
      })
    }
  }, []);

  const handleContextMenu = useCallback((e) => {
    if (trackClicks) {
      e.preventDefault();
      setClickValue(currentValue => {
        const newValue = Math.max(currentValue - 1, 0);
        onRightClick(newValue, currentValue);
        return newValue;
      })
    }
  }, [])

  return (
    <div css={cellStyles} className={className} onClick={handleClick} onContextMenu={handleContextMenu} {...rest} />
  );
}

Cell.propTypes = {
  bgColors: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  defaultClickValue: PropTypes.number,
  maxHeight: PropTypes.string,
  onLeftClick: PropTypes.func,
  onRightClick: PropTypes.func,
  trackClicks: PropTypes.bool,
}

Cell.defaultProps = {
  bgColors: ['#0f0','#00f','#fff','#000','#f00'],
  className: undefined,
  defaultClickValue: 2,
  maxHeight: 'auto',
  onLeftClick: () => { },
  onRightClick: () => { },
  trackClicks: false,
}

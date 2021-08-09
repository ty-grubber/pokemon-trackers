import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

export default function Cell({
  bgColors,
  className,
  defaultClickValue,
  matchesSearch,
  maxHeight,
  onLeftClick,
  onRightClick,
  trackClicks,
  ...rest
}) {
  const [clickValue, setClickValue] = useState(defaultClickValue);
  const cellStyles = css`
    background-color: ${bgColors[clickValue]};
    flex-grow: 1;
    max-height: ${maxHeight};
    opacity: ${matchesSearch ? '1' : '0.3'};
`
  const handleClick = useCallback(() => {
    if (trackClicks) {
      setClickValue(currentValue => {
        const newValue = Math.min(currentValue + 1, bgColors.length - 1);
        onLeftClick(newValue, currentValue);
        return newValue;
      })
    }
  }, [bgColors.length, onLeftClick, trackClicks]);

  const handleContextMenu = useCallback((e) => {
    if (trackClicks) {
      e.preventDefault();
      setClickValue(currentValue => {
        const newValue = Math.max(currentValue - 1, 0);
        onRightClick(newValue, currentValue);
        return newValue;
      })
    }
  }, [onRightClick, trackClicks]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      css={cellStyles}
      className={className}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleClick}
      {...rest}
    />
  );
}

Cell.propTypes = {
  bgColors: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  defaultClickValue: PropTypes.number,
  matchesSearch: PropTypes.bool,
  maxHeight: PropTypes.string,
  onLeftClick: PropTypes.func,
  onRightClick: PropTypes.func,
  trackClicks: PropTypes.bool,
}

Cell.defaultProps = {
  bgColors: ['#0f0','#00f','#fff','#000','#f00'],
  className: undefined,
  defaultClickValue: 2,
  matchesSearch: true,
  maxHeight: 'auto',
  onLeftClick: () => { },
  onRightClick: () => { },
  trackClicks: false,
}

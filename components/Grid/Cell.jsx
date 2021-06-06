import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

export default function Cell({
  className,
  onLeftClick,
  onRightClick,
  ...rest
}) {
  const cellStyles = css`
    flex-grow: 1;
`
  const handleClick = useCallback((e) => {
    if (e.nativeEvent.which === 1) {
      onLeftClick(e);
    } else if (e.nativeEvent.which === 3) {
      e.preventDefault();
      onRightClick(e);
    }
  }, [])
  return (
    <div css={cellStyles} className={className} onClick={handleClick} {...rest} />
  );
}

Cell.propTypes = {
  className: PropTypes.string,
  onLeftClick: PropTypes.func,
  onRightClick: PropTypes.func,
}

Cell.defaultProps = {
  className: undefined,
  onLeftClick: () => { },
  onRightClick: () => { },
}

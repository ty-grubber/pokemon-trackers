import classnames from 'classnames/bind';
import styles from './Boom.module.css';

const cx = classnames.bind(styles);

export default function MinesweeperCell({
  item,
  onCellClick,
}) {
  const onClick = () => {
    onCellClick(item);
  };

  const cellClass = (() => {
    switch (item.mineState) {
      case 'revealed': // TODO: Make these constants available in this file
        if (item.isMine) {
          return 'explodedCell';
        } else {
          return 'revealedCell';
        }
      case 'flagged':
        return 'flaggedCell';
      default:
        return 'minesweeperCell';
    }
  })();

  const number = (() => {
    if (item.numberOfAdjacentMines && item.mineState === 'revealed' && !item.isMine) {
      return <p className={cx('minesweeperCellNumber')} title={item.name}>
        {item.numberOfAdjacentMines}
      </p>
    }
  })();

  return <div
    className={cx('minesweeperCellContainer')}
    onClick={onClick}
  >
    <img
      alt={item.name}
      className={cx(cellClass)}
      src={`/images/pokemon/${item.number}.png`}
    />
    {number}
  </div>
}

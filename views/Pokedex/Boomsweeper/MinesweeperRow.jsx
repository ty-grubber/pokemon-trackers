import classnames from 'classnames/bind';
import MinesweeperCell from './MinesweeperCell';
import styles from './Boomsweeper.module.css';

const cx = classnames.bind(styles);

export default function MinesweeperRow({
  row,
  cellClickAction,
  cellRightClickAction,
  searchTerm,
}) {
  return <div className={cx('gridRow')}>
    {
      row.map((item) => {
        return <MinesweeperCell
          item={item}
          clickAction={cellClickAction}
          rightClickAction={cellRightClickAction}
          searchTerm={searchTerm}
        />
      })
    }
  </div>
}

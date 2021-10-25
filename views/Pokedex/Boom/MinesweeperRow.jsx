import classnames from 'classnames/bind';
import MinesweeperCell from './MinesweeperCell';
import styles from './Boom.module.css';

const cx = classnames.bind(styles);

export default function MinesweeperRow({
  row,
  onCellClick,
}) {
  return <div className={cx('gridRow')}>
    {
      row.map((item) => {
        return <MinesweeperCell item={item} onCellClick={onCellClick}/>
      })
    }
  </div>
}

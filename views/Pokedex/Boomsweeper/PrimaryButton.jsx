import classnames from 'classnames/bind';
import styles from './Boom.module.css';

const cx = classnames.bind(styles);

export default function PrimaryButton({
  title,
  onClick,
  style,
}) {
  return <div
    className={cx('primaryButton')}
    onClick={onClick}
    style={style}
  >
    {title}
  </div>
}

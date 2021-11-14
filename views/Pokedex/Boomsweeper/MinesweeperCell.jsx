export const MINE_STATE = {
  default: "default",
  marked_as_safe: "marked_as_safe",
  flagged: "flagged",
  revealed: "revealed",
  exploded: "exploded",
};

export const DEX_STATE = {
  none: "none",
  seen: "seen",
  caught: "caught",
}

export default function MinesweeperCell({
  item,
  clickAction,
  rightClickAction,
  searchTerm,
}) {
  const searchIsActive = searchTerm && searchTerm !== ''
  const itemMatchesSearch = !searchIsActive || item.name.toLowerCase().includes(searchTerm.toLowerCase());

  const backgroundColor = (() => {
    switch (item.mineState) {
      case MINE_STATE.default: return 'lightGray';
      case MINE_STATE.marked_as_safe: return '#AA88EE';
      case MINE_STATE.flagged: return 'darkRed';
      case MINE_STATE.revealed: return item.isMine ? 'red' : 'white';
      case MINE_STATE.exploded: return item.isMine ? 'red' : 'pink';
    }
  })();

  const border = (() => {
    switch (item.mineState) {
      case MINE_STATE.default: return '1px solid darkGray';
      case MINE_STATE.marked_as_safe: return '1px solid darkGray';
      case MINE_STATE.flagged: return '1px solid darkGray';
      case MINE_STATE.revealed:return item.isMine ?'1px solid darkGray' : '1px solid lightGray';
      case MINE_STATE.exploded: return '1px solid lightGray';
    }
  })();

  const imageOpacity = (() => {
    if (
      !item.isMine && (
        item.mineState === MINE_STATE.revealed ||
        item.mineState === MINE_STATE.exploded
      )
    ) {
      return 0.3
    } else {
      return 1
    }
  })();

  const numberOfAdjacentMinesElement = (() => {
    if (
      item.numberOfAdjacentMines &&
      !item.isMine && (
        item.mineState === MINE_STATE.revealed ||
        item.mineState === MINE_STATE.exploded
      )
    ) {
      return <p
        style={{
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: '50px',
            minWidth: '50px',
            position: 'absolute',
            margin: 0,
            padding: 0,
            top: 0,
        }}
        title={item.name}
      >
        {item.numberOfAdjacentMines}
      </p>
    }
  })();

  const dexStateElement = (() => {
    const backgroundColor = (() => {
      switch (item.dexState) {
        case DEX_STATE.seen: return 'blue';
        case DEX_STATE.caught: return 'green';
      }
    })();

    if (item.dexState !== DEX_STATE.none) {
      return <div
        style={{
          backgroundColor: backgroundColor,
          border: '2px solid white',
          borderRadius: '7.5px',
          position: 'absolute',
          width: '15px',
          height: '15px',
          margin: '1px',
          padding: 0,
          top: 0,
          right: 0,
        }}
      ></div>
    }
  })();

  const onClick = () => {
    clickAction(item);
  };

  const onRightClick = (e) => {
    e.preventDefault();
    rightClickAction(item);
  };

  return <div
    style={{
      position: 'relative',
      cursor: 'pointer',
    }}
    onClick={onClick}
    onContextMenu={onRightClick}
  >
    <div
      style={{
        backgroundColor: backgroundColor,
        border: border,
        opacity: itemMatchesSearch ? 1 : 0.3
      }}
    >
      <img
        style={{
          opacity: imageOpacity,
          width: '50px',
          height: '50px',
          padding: '2.5px',
        }}
        alt={item.name}
        src={`/images/pokemon/gen2/${item.number}.png`}
      />
      {numberOfAdjacentMinesElement}
      {dexStateElement}
    </div>
    <div
      style={{
        display: searchIsActive && itemMatchesSearch ? 'block' : 'none',
        border: '3px solid black',
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
      }}
    ></div>
  </div>
}

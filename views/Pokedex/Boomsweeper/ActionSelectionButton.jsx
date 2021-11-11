export const ACTION = {
  mark_as_safe: {
    id: 'mark_as_safe',
    title: 'Mark As Safe',
    backgroundColor: '#AA88EE99',
    selectedBackgroundColor: '#7755EE',
  },
  mark_as_seen: {
    id: 'mark_as_seen',
    title: 'Mark As Seen',
    backgroundColor: '#88AAEE99',
    selectedBackgroundColor: '#5577EE',
  },
  mark_as_caught: {
    id: 'mark_as_caught',
    title: 'Mark As Caught',
    backgroundColor: '#22AA0099',
    selectedBackgroundColor: '#007700',
  },
  flag: {
    id: 'flag',
    title: 'Flag',
    backgroundColor: '#AA88EE99',
    selectedBackgroundColor: '#7755EE',
  },
  reveal: {
    id: 'reveal',
    title: 'Reveal',
    backgroundColor: '#99999999',
    selectedBackgroundColor: '#666666',
  },
  explode: {
    id: 'explode',
    title: 'Explode',
    backgroundColor: '#EE666699',
    selectedBackgroundColor: '#EE3333',
  },
  reset: {
    id: 'reset',
    title: 'Reset',
    backgroundColor: '#33333399',
    selectedBackgroundColor: '#111111',
  },
};

export default function ActionSelectionButton({
  action,
  isSelected,
  onClickHandler,
}) {
  return <div
    style={{
      width: '135px',
      backgroundColor: isSelected ? '#FF9900' : 'gray',
      borderRadius: '5px',
      userSelect: 'none',
      cursor: 'pointer',
      boxShadow: !isSelected ? '3px 3px 3px #00000050' : '',
      border: isSelected ? '1px solid gray' : '',
    }}
  >
    <div
      style={{
        boxShadow: isSelected ? 'inset 3px 3px 3px #00000050' : '',
        backgroundColor: isSelected ? action.selectedBackgroundColor : action.backgroundColor,
        border: isSelected ? '1px solid black' : '',
        borderRadius: '5px',
        color: 'white',
        height: '40px',
        lineHeight: '40px',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        margin: '5px',
      }}
      onClick={() => { onClickHandler(action); }}
    >
      {action.title}
    </div>
  </div>
}

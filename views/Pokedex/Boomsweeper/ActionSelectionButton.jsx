export const ACTION = {
  mark_as_safe: "mark_as_safe",
  mark_as_seen: "mark_as_seen",
  mark_as_caught: "mark_as_caught",
  flag: "flag",
  reveal: "reveal",
  explode: "explode",
  reset: "reset",
};

export default function ActionSelectionButton({
  action,
  currentAction,
  clickAction,
}) {
  const isSelected = action === currentAction;

  const title = (() => {
    switch (action) {
      case ACTION.mark_as_safe: return "Mark As Safe";
      case ACTION.mark_as_seen: return "Mark As Seen";
      case ACTION.mark_as_caught: return "Mark As Caught";
      case ACTION.flag: return "Flag";
      case ACTION.reveal: return "Reveal";
      case ACTION.explode: return "Explode";
      case ACTION.reset: return "Reset";
    }
  })();

  const backgroundColor = (() => {
    switch (action) {
      case ACTION.mark_as_safe: return isSelected ? '#7755EE' : '#AA88EE99';
      case ACTION.mark_as_seen: return isSelected ? '#5577EE' : '#88AAEE99';
      case ACTION.mark_as_caught: return isSelected ? '#007700' : '#22AA0099';
      case ACTION.reveal: return isSelected ? '#666666' : '#99999999';
      case ACTION.explode: return isSelected ? '#EE3333' : '#EE666699';
      case ACTION.reset: return isSelected ? '#111111' : '#33333399';
    }
  })();

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
        backgroundColor: backgroundColor,
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
      onClick={() => { clickAction(action); }}
    >
      {title}
    </div>
  </div>
}

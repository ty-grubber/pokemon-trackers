function convertTo2DArray(arr, columns) {
  var arr1d = [...arr];
  var arr2d = [];

  while (arr1d.length > 0) {
    arr2d.push(arr1d.splice(0, columns))
  }

  return arr2d;
}

function flatten2DArray(arr2d) {
  return arr2d.reduce((prev, next) => {
    return prev.concat(next);
  });
}

function convertIndexTo2DIndex(index, columns) {
  const i = Math.floor(index / columns);
  const j = index % columns;

  return { i, j };
}

function convert2DIndexToIndex(ddIndex, columns) {
  return ddIndex.i * columns + ddIndex.j;
}

export {
  convert2DIndexToIndex,
  convertIndexTo2DIndex,
  convertTo2DArray,
  flatten2DArray,
}

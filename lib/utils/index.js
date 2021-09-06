function convertTo2DArray(arr, columns) {
  var arr1d = [...arr];
  var arr2d = [];

  while (arr1d.length > 0) {
    arr2d.push(arr1d.splice(0, columns))
  }

  return arr2d;
}

export {
  convertTo2DArray,
}

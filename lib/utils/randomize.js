import seedrandom from 'seedrandom';
import { NATIONAL_DEX } from '../constants/pokedex';

function randomizeArray(arr, seed) {
  const newArr = [...arr];
  const rng = seedrandom(seed);
  for (var i = newArr.length - 1; i > 0; i--) {
    const swapIndex = Math.floor(rng() * (i + 1));
    const currentEntry = newArr[i];
    const entryToSwap = newArr[swapIndex];
    newArr[i] = entryToSwap;
    newArr[swapIndex] = currentEntry;
  }
  return newArr;
}

function randomizePokedex(seed) {
  return randomizeArray(NATIONAL_DEX, seed);
}

export {
  randomizeArray,
  randomizePokedex
}

import React from 'react';
import Boomsweeper from '../../views/Pokedex/Boomsweeper';
import { useRouter } from 'next/router';
import { LAYOUT_TYPE } from '../../lib/constants/layout';

export default function BoomsweeperPage() {
  const router = useRouter();

  const seed = router.query.seed ?? ''
  let layout = router.query.layout;

  if (
    layout !== LAYOUT_TYPE.numerical &&
    layout !== LAYOUT_TYPE.alphabetical &&
    layout !== LAYOUT_TYPE.random
  ) {
    layout = LAYOUT_TYPE.random;
  }

  return <Boomsweeper
    seed={seed}
    layoutType={layout}
  />
}

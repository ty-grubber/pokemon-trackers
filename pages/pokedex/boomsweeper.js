import React from 'react';
import Boomsweeper from '../../views/Pokedex/Boomsweeper';
import { useRouter } from 'next/router';
import { LAYOUT_TYPE } from '../../lib/constants/layout';

export default function BoomsweeperPage() {
  const router = useRouter();

  const seed = router.query.seed ?? ''
  const layoutType = Object.values(LAYOUT_TYPE).find((layout) => {
    return layout.id === router.query.layout;
  }) ?? LAYOUT_TYPE.random;

  return <Boomsweeper
    seed={seed}
    layoutType={layoutType}
  />
}

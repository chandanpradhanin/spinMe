import type { ComponentType } from 'react';

import { TabScreenTransition } from './TabScreenTransition';

export function makeTabScreen<P extends object>(
  Screen: ComponentType<P>,
): ComponentType<P> {
  return function TabScreen(props: P) {
    return (
      <TabScreenTransition>
        <Screen {...props} />
      </TabScreenTransition>
    );
  };
}

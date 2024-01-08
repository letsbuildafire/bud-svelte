import type {Item, Loader, Rule} from '@roots/bud-framework'

import type SvelteBud from './extension.js'

declare module '@roots/bud-framework' {
  interface Bud {
    svelte: SvelteBud
  }

  interface Modules {
    'bud-svelte-loader': SvelteBud,
  }

  interface Loaders {
    svelte: Loader
  }

  interface Items {
    svelte: Item
  }

  interface Rules {
    svelte: Rule
  }
}

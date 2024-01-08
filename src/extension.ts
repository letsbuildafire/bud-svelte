import type {Bud} from '@roots/bud-framework'
import type {WebpackPluginInstance} from '@roots/bud-framework/config'

import {Extension} from '@roots/bud-framework/extension'
import {
  bind,
  expose,
  label,
} from '@roots/bud-framework/extension/decorators'

interface Options {}

/**
 * Svelte configuration
 */
@label(`bud-svelte-loader`)
@expose(`svelte`)
export default class SvelteBud extends Extension<
  Options,
  WebpackPluginInstance
> {
  /**
   * {@link Extension.reister}
   */
  @bind
  public override async register({hooks, path, build}: Bud) {
    /** Source loader */
    const loader = await this.resolve(`svelte-loader`, import.meta.url)
    if (!loader) return this.logger.error(`svelte-loader not found`)

    /** Set loader alias */
    hooks.on(`build.resolveLoader.alias`, (aliases = {}) => ({
      ...aliases,
      [`svelte-loader`]: loader,
    }))

    /** .svelte */
    build
      .setLoader(`svelte`, `svelte-loader`)
      .setItem(`svelte`, {
        ident: `svelte`,
        loader: `svelte`,
      })

    await hooks
      .on(`build.resolve.extensions`, (extensions = new Set()) =>
        extensions.add(`.svelte`),
      )
      .hooks.on(`build.module.rules.before`, (rules = []) => [
        ...rules,
        {
          include: [path(`@src`)],
          test: /\.svelte$/,
          use: [build.items.svelte],
        },
      ])
      .extensions.add({
        label: `svelte-loader`,
        make: async () => {
          const {SvelteLoader} = await this.import(
            `svelte-loader`,
            import.meta.url,
            {raw: true},
          )
          return new SvelteLoader()
        },
      })
  }
}

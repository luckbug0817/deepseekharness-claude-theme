# DeepSeek Claude Web Theme

This is a static DeepSeek Harness Web client plugin. Add it to a compatible
Harness Web profile together with `@deepseek-ai/dsh-client-ui-theme`; the
profile must expose the public `ctx.theme.register(definition)` service before
this plugin activates. The client entry exports `inject = ['theme']`, which is
the Cordis declaration that parks this Fiber until that service is available.
The package manifest's `dsh.client.inject` mirrors the graph dependency for
profile discovery; it does not order activation by itself.

The package intentionally has no npm peer dependency on Harness internals.
The current registry does not publish a complete independently resolvable
Harness client dependency graph, so installing this package alone does not
create a runnable Web profile. If activation reports that `theme` is absent,
upgrade or repair the Harness profile so its UI-theme client plugin is composed
and enabled, then restart the Web server.

Compatibility was checked against DeepSeek Harness master: external client
packages are discovered from the profile's composed Loader entries by
`dsh.client`, and the profile's config package is the resolution anchor for
those entries. The static client uses the injected Cordis service rather than
importing an internal implementation.

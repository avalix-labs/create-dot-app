// Nuxt generates the base flat config (.nuxt/eslint.config.mjs) via the
// @nuxt/eslint module during `nuxt prepare`. Extend it with your own rules here.
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: ['.nuxt/**', '.output/**', 'dist/**', 'node_modules/**', 'contracts/**'],
  },
)

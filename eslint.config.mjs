// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import pluginTailwindCss from 'eslint-plugin-tailwindcss'

export default createConfigForNuxt({
  features: {
    stylistic: true,
  },
}).append(
  pluginTailwindCss.configs['flat/recommended'],
)

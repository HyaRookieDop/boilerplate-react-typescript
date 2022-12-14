import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    // if you are excluding files, make sure you always include node_modules and .git
    exclude: ['node_modules', '.git', 'dist'],
  },
  theme: {
    extend: {
      colors: {
        primary: '#1890FF',
        tertiary: 'var(--semi-grey-8)',
      },
    },
  },
})

const path = require('node:path')

/** @type { import('@storybook/react-vite').StorybookConfig } */
module.exports = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve ??= {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@taqseet-ui/tokens': path.resolve(__dirname, '../../tokens/src/index.css'),
      '@taqseet-ui/styles/globals.css': path.resolve(__dirname, '../../styles/src/globals.css'),
      '@/shared/components/ui': path.resolve(__dirname, '../src/components'),
      '@/shared/components/layout': path.resolve(__dirname, '../src/components/layout'),
      '@/shared/hooks': path.resolve(__dirname, '../src/hooks'),
      '@/shared/contexts': path.resolve(__dirname, '../src/contexts'),
      '@/shared/utils': path.resolve(__dirname, '../src/utils'),
      '@/shared/config': path.resolve(__dirname, '../src/config'),
      '@/shared/constants': path.resolve(__dirname, '../src/constants'),
      '@/shared/providers': path.resolve(__dirname, '../src/providers'),
    }
    return config
  },
}

import type { Preview } from '@storybook/react'
import '../../tokens/src/index.css'
import '../../styles/src/globals.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  globalTypes: {
    theme: {
      description: 'Global theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      document.documentElement.setAttribute('data-theme', context.globals.theme)
      return (
        <div data-visual-frame style={{ width: 280, display: 'inline-block' }}>
          <Story />
        </div>
      )
    },
  ],
}

export default preview

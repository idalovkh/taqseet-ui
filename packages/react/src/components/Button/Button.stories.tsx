import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  args: {
    children: 'Сохранить',
    variant: 'primary',
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Отмена' },
}

export const DarkPrimary: Story = {
  parameters: { globals: { theme: 'dark' } },
}

import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  args: {
    children: 'Active',
    variant: 'success',
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Success: Story = {}

export const Warning: Story = {
  args: { variant: 'warning', children: 'Pending' },
}

export const Dark: Story = {
  parameters: { globals: { theme: 'dark' } },
}

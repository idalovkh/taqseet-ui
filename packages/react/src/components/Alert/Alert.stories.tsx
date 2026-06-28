import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  args: {
    children: 'Payment schedule updated successfully.',
    variant: 'success',
  },
}

export default meta
type Story = StoryObj<typeof Alert>

export const Success: Story = {}

export const Warning: Story = {
  args: { variant: 'warning', children: 'Subscription expires in 7 days.' },
}

export const Dark: Story = {
  parameters: { globals: { theme: 'dark' } },
}

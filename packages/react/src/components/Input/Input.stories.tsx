import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  args: {
    label: 'Email',
    placeholder: 'name@company.ru',
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const WithError: Story = {
  args: { error: 'Обязательное поле' },
}

export const Dark: Story = {
  parameters: { globals: { theme: 'dark' } },
}

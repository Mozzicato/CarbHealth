import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import FoodLogger from './FoodLogger'
import { FOODS } from '../data/foods'

describe('FoodLogger', () => {
  it('calls onAdd with selected food and quantity', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()

    render(<FoodLogger onAdd={onAdd} />)

    // select first food and change qty
    const select = screen.getByRole('combobox')
    await user.selectOptions(select, `${FOODS[0].id}`)

    const qty = screen.getByRole('spinbutton')
    await user.clear(qty)
    await user.type(qty, '2')

    const btn = screen.getByRole('button', { name: /add to log/i })
    await user.click(btn)

    expect(onAdd).toHaveBeenCalled()
    const arg = onAdd.mock.calls[0][0]
    expect(arg.food.id).toBe(FOODS[0].id)
    expect(arg.quantity).toBe(2)
  })
})

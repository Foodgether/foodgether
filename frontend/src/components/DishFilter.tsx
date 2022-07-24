import { FormElement, Input } from '@nextui-org/react'
import React from 'react'
import CartIcon from './CartIcon'

interface DishFilterProps {
  onChange: (e: React.ChangeEvent<FormElement>) => void
}

const DishFilter = ({ onChange }: DishFilterProps) => {
  return (
    <Input
      onChange={onChange}
      fullWidth
      placeholder='Find your fave'
      contentLeft={<CartIcon />}
      clearable
      aria-label='Search dish'
    />
  )
}

export default DishFilter

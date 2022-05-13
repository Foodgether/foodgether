import React from 'react';
import {useLocation} from 'react-router'
import Card from './Card';
import {MenuState} from './interface'

const Menu = () => {
  const location = useLocation();
  const {menu} = location.state as MenuState;

  return <div className="flex flex-col max-w-2xl m-auto">
    {menu.length > 0 &&
      menu.map(
        (dishType) => {
          return dishType.dishes.map(dish => {
            if (!dish.is_available) {
              return <></>
            }
            return <Card key={dish.name} price={dish.price} name={dish.name} photos={dish.photos}/>
          })
        })
    }
  </div>
}

export default Menu

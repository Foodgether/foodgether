import {useLocation} from 'react-router'
import Card from './Card';

type MenuItem = {
  name: string;
  price: number;
  image: string;
}
type MenuState = {
  menu: MenuItem[];
}

const Menu = () => {
  const location = useLocation();
  const {menu} = location.state as MenuState;

  return <div className="flex flex-col max-w-2xl m-auto">
    {menu.length > 0 &&
      menu.map(
        ({name, price, image}) => <Card key={name} price={price} name={name} image={image}/>)
    }
  </div>
}

export default Menu

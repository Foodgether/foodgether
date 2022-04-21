import { useState, ChangeEvent } from 'react'
import './Home.css'
import './index.css'
import {useNavigate} from 'react-router';

function Home() {
  const [url, setUrl] = useState('')
  // const [menu, setMenu] = useState([])

  const setTargetUrl = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }

  const handleGetMenu = async () => {
    console.log({
      url,
      getOutOfStock: false
    })
    const rawMenuResponse = await fetch('http://localhost:3000/menu', {
      method: 'POST',
      body: JSON.stringify({
        url,
        getOutOfStock: false
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const menuResponse = await rawMenuResponse.json();
    // setMenu(menuResponse);
    navigate('/menu', { replace: true, state: { menu: menuResponse } });
  }

  const navigate = useNavigate();

  return (
    <div className="App">
      {/*<Navbar />*/}
      <label className="text-3xl font-bold underline">Enter your Shopee Food</label>
      <br/>
      <input onChange={setTargetUrl}/>
      <br/>
      <button onClick={handleGetMenu}>Get Menu</button>
    </div>
  )
}

export default Home

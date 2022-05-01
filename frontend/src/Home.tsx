import { useState, ChangeEvent } from 'react'
import './Home.css'
import './index.css'
import {useNavigate} from 'react-router';
import Spinner from './Home/Spinner';
import loadingMessages from './utils/loading-messages';
import Swal from 'sweetalert2';
import {BACKEND_URL, BASE_PATH} from './config';

function Home() {
  const [url, setUrl] = useState('')
  const [isShowingSpinner, setSpinner] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

  const setTargetUrl = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }

  const handleGetMenu = async () => {
    setSpinner(true)
    setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])
    const interval = setInterval(() => {
      setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])
    }, 2000)
      const rawMenuResponse = await fetch(`${BACKEND_URL}/menu`, {
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
    clearInterval(interval);
    setSpinner(false);
    if (!rawMenuResponse.ok) {
      const {message} = await rawMenuResponse.json()
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500
      })
      return;
    }
    const menuResponse = await rawMenuResponse.json();
    navigate(`${BASE_PATH}/menu`, { replace: true, state: { menu: menuResponse } });
  }

  const navigate = useNavigate();

  return (
    <div className="App max-w-4xl m-auto">
      <div className="text-5xl font-bold text-pink-900 my-10">Enter your Shopee Food</div>
      <br/>
      <input id="url" onChange={setTargetUrl} className="focus:outline-pink-900 text-2xl border rounded-lg block w-full p-2.5 bg-gray-100 border-pink-900 placeholder-gray-400 text-pink-900 font-semibold" placeholder="https://shopeefood.vn/ho-chi-minh/quan-an-com-tam-31-dong-den" required/>
      <br/>
      <button onClick={handleGetMenu} disabled={isShowingSpinner} type="button"
              className="max-w-xl max-h-24 text-3xl font-bold text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-800 rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Get Menu
      </button>
      <br/>
      {isShowingSpinner &&
          <>
            <Spinner/>
            <br/>
            <h5 className="mb-2 text-3xl font-bold tracking-tight text-pink-900">{loadingMessage}</h5>
          </>}
    </div>
  )
}

export default Home

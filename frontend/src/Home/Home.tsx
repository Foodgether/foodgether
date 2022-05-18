import React, { useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router';
import Loader from '../components/Loader';
import { getRandomMessage } from '../utils/loading-messages';
import Swal from 'sweetalert2';
import { BACKEND_URL, BASE_PATH } from '../config';
import {
  Button,
  FormElement,
  Input,
  Loading,
  Spacer,
  Text,
} from '@nextui-org/react';

function Home() {
  const [url, setUrl] = useState('');
  const [isShowingSpinner, setSpinner] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const setTargetUrl = (e: React.ChangeEvent<FormElement>) => {
    setUrl(e.target.value);
  };

  const handleGetMenu = async () => {
    setSpinner(true);
    setLoadingMessage(getRandomMessage());
    const interval = setInterval(() => {
      setLoadingMessage(getRandomMessage());
    }, 2000);
    const rawMenuResponse = await fetch(`${BACKEND_URL}/menu`, {
      method: 'POST',
      body: JSON.stringify({
        url,
        getOutOfStock: false,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    clearInterval(interval);
    setSpinner(false);
    if (!rawMenuResponse.ok) {
      const { message } = await rawMenuResponse.json();
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    const menuResponse = await rawMenuResponse.json();
    navigate(`${BASE_PATH}/menu`, { state: { menu: menuResponse } });
  };

  const navigate = useNavigate();

  return (
    <div className="App max-w-4xl m-auto">
      <Spacer y={5} />
      <Text h1 size="3.5em" color="primary">
        Enter your Shopee Food
      </Text>
      <Spacer y={3} />
      <Input
        clearable
        rounded
        bordered
        placeholder="https://shopeefood.vn/ho-chi-minh/quan-an-com-tam-31-dong-den"
        aria-label="Input your shopeefood URL"
        id="url"
        type="url"
        required
        fullWidth
        label=""
        disabled={isShowingSpinner}
        onChange={setTargetUrl}
        color="primary"
      />
      <Spacer y={1} />
      <Button
        onPress={handleGetMenu}
        color="gradient"
        auto
        ghost
        css={{ width: '10em', margin: 'auto' }}
        disabled={isShowingSpinner}
      >
        {isShowingSpinner ? (
          <Loading color="currentColor" size="sm" />
        ) : (
          <Text h5>Get Menu</Text>
        )}
      </Button>
      <Spacer y={1} />
      <Loader
        isShowingLoader={isShowingSpinner}
        loadingMessage={loadingMessage}
      />
    </div>
  );
}

export default Home;

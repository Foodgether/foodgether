import { Container } from '@nextui-org/react';
import React from 'react';
import Spinner from './Spinner';

interface LoaderProps {
  isShowingLoader: boolean;
  loadingMessage?: string;
  spinner?: boolean;
}

const Loader = ({
  isShowingLoader,
  loadingMessage = '',
  spinner,
}: LoaderProps) => {
  if (!isShowingLoader) {
    return <></>;
  }
  return (
    <Container direction="column">
      {spinner && <Spinner />}
      <h5 className="mb-2 text-3xl font-bold tracking-tight text-pink-900">
        {loadingMessage}
      </h5>
    </Container>
  );
};

export default Loader;

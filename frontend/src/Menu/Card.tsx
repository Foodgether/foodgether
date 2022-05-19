import React from 'react';
import { Card as NextCard, Grid, Spacer, Text } from '@nextui-org/react';

interface CardMenuProps {
  id: number;
  name: string;
  photos: Photo[];
  price: {
    text: string;
    unit: string;
    value: number;
  };
  description?: string;
}

type Photo = {
  width: number;
  height: number;
  value: string;
};

const Card = (props: CardMenuProps) => {
  const { name, price, photos } = props;
  const photoLastIndex = photos.length - 2;
  const photo = photos[photoLastIndex];

  return (
    <NextCard hoverable animated>
      <NextCard.Body css={{ p: 0 }}>
        <Grid.Container justify="center">
          <Grid xs={12} md={2}>
            <NextCard.Image
              objectFit="scale-down"
              src={photo.value}
              alt={name}
            />
          </Grid>
          <Grid xs={1} md={0.5} />
          <Grid xs={12} md direction={'column'}>
            <Text h2>{name}</Text>
            <Text h3 css={{ color: '$red500', fontWeight: '$semibold' }}>
              {price.text}
            </Text>
            {props.description && <Spacer y={0.5} />}
            {props.description && (
              <Text css={{ color: '$accents7', fontWeight: '$semibold' }}>
                {props.description}
              </Text>
            )}
          </Grid>
        </Grid.Container>
      </NextCard.Body>
    </NextCard>
  );
};

export default Card;

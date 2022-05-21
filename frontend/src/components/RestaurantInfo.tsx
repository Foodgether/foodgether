import { Grid, Image, Spacer, Text } from "@nextui-org/react";
import React from "react";
import { Restaurant } from "../interfaces/restaurant";

type RestaurantInfoProps = Restaurant;

const RestaurantInfo = (props: RestaurantInfoProps) => {
  const photoIndex =
    props.photos.length >= 2
      ? props.photos.length - 2
      : props.photos.length - 1;
  const photo = props.photos[photoIndex];
  return (
    <Grid.Container css={{ backgroundColor: "$accents0" }}>
      <Grid xs={12} md={5} justify="center" alignItems="center">
        <Image src={photo.value} objectFit="scale-down" />
      </Grid>
      <Grid xs={0} md={0.5} />
      <Grid xs={12} md={6.5} direction="column">
        <a target="_blank" href={props.url}>
          <Text h2>{props.name}</Text>
        </a>
        <Spacer y={0.5} />
        <Text h5 css={{ color: "$accents7", fontWeight: "$semibold" }}>
          {props.address}
        </Text>
        <Spacer y={0.5} />
        <Text h5 css={{ color: "$red500", fontWeight: "$semibold" }}>
          {props.priceRange.minPrice}đ - {props.priceRange.maxPrice}đ
        </Text>
        <Spacer y={0.5} />

        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDd-FwBpVfoNt_6nq8zYRpFM-_diGBqC74
    &center=${props.position.latitude},${props.position.longitude}&q=${props.position.latitude},${props.position.longitude}`}
        ></iframe>
      </Grid>
    </Grid.Container>
  );
};

export default RestaurantInfo;

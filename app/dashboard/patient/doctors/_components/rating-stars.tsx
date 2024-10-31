"use client";

import { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";

export const RatingStars = ({ rating }: { rating: number }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return <Rating readonly initialValue={rating} allowFraction size={18} />;
};

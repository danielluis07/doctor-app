"use client";

import Image from "next/image";
import placeholder from "@/public/placeholder-logo.jpg";
import Link from "next/link";
import { RatingStars } from "./rating-stars";

type DoctorCardProps = {
  id: string;
  name: string | null | undefined;
  speciality: string | null;
  rating: number;
  image: string | null | undefined;
  reviewsCount: number;
};
export const DoctorCard = ({
  id,
  name,
  speciality,
  rating,
  image,
  reviewsCount,
}: DoctorCardProps) => {
  return (
    <Link href={`/dashboard/patient/doctors/${id}`}>
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 flex items-center">
        <div className="relative size-28 flex-shrink-0 rounded-lg overflow-hidden mr-4">
          <Image
            src={image || placeholder}
            alt="doctor"
            fill
            sizes="200px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="font-bold text-xl mb-2">{name}</div>
          <p className="bg-blue-100 text-blue-800 text-[11px] font-medium px-2 py-1 rounded-full inline-block">
            {speciality}
          </p>
          <div className="flex gap-x-2 mt-2">
            <RatingStars rating={rating} />
            <span className="text-[12px] mt-[7px]">({reviewsCount})</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

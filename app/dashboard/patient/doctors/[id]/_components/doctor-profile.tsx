"use client";

import Image from "next/image";
import placeholder from "@/public/placeholder-logo.jpg";
import {
  Mail,
  Briefcase,
  User,
  MapPin,
  Hospital,
  Phone,
  Banknote,
  GraduationCap,
} from "lucide-react";
import { Doctor } from "@/queries/doctors/get-doctor";
import { Rating } from "react-simple-star-rating";
import { useEffect } from "react";

export const DoctorProfile = ({ data }: { data: Doctor }) => {
  const roundedRating = parseFloat(Number(data.averageRating).toFixed(1));

  const roundToHalf = (num: number) => {
    return Math.round(num * 2) / 2;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-white shadow-xl rounded-2xl overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3 bg-gradient-to-br from-sky-400 to-blue-500 p-8 text-white">
          <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={data.user?.image || placeholder}
              alt={data.user?.name || "Doctor"}
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">
            {data.user?.name}
          </h1>
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sky-200 text-sky-800">
              {data.doctor?.specialty}
            </span>
          </div>
          <p className="text-center mb-6">
            <span className="font-semibold">CFM:</span> {data.doctor?.cfm}
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <GraduationCap className="text-lg mr-3" />
              <span>{data.doctor?.education}</span>
            </div>
            <div className="flex items-center">
              <Mail className="text-lg mr-3" />
              <span>{data.user?.email}</span>
            </div>
            <div className="flex items-center">
              <Hospital className="text-lg mr-3" />
              <span>{data.doctor?.doctor_office}</span>
            </div>
            <div className="flex items-center">
              <Phone className="text-lg mr-3" />
              <span>{data.user.phone}</span>
            </div>
          </div>
        </div>
        <div className="md:w-2/3 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <MapPin className="text-lg mr-2 text-sky-500" />
              Endereço
            </h2>
            <p className="text-gray-500 font-semibold">
              Bairro {data.user.address}
            </p>
            <p className="text-gray-700">{data.user.address2}</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <User className="text-lg mr-2 text-sky-500" />
              Resumo
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.doctor?.bio}</p>
          </div>
          <div className="mt-8">
            <h2 className="flex items-center text-xl mb-3 text-gray-700 font-semibold">
              <Banknote className="text-lg mr-2 text-sky-500" />
              Preço
            </h2>
            <span className="text-gray-700">{data.doctor?.price}</span>
          </div>
          <div className="mt-8">
            <h4>Opiniões sobre o médico:</h4>
            <div className="flex items-center gap-x-2 mt-3">
              <Rating
                allowFraction
                readonly
                size={25}
                initialValue={roundToHalf(roundedRating)}
              />
              <span>({data.reviewsCount})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import Image from "next/image";
import Link from "next/link";
import placeholder from "@/public/placeholder-logo.jpg";
import { RemoveBtn } from "./remove-btn";

type DoctorData = {
  doctor: {
    id: string;
    createdAt: string | null;
    updatedAt: string | null;
    userId: string;
    gender: "MALE" | "FEMALE" | null;
    specialty: string | null;
    doctor_office: string | null;
    price: string | null;
    education: string | null;
    cfm: string | null;
    bio: string | null;
  } | null;
  user: {
    name: string | null;
    image: string | null;
  } | null;
  patientId: string;
};

export const FavoriteCard = ({ doctor, user, patientId }: DoctorData) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="relative w-full h-48 mb-4 rounded-t-lg">
        <Image
          src={user?.image || placeholder}
          alt={user?.name || "Doctor"}
          fill
          sizes="(max-width: 640px) 100vw, 
                     (max-width: 1024px) 50vw, 
                     25vw"
        />
      </div>
      <div className="text-center">
        <Link href={`/dashboard/patient/doctors/${doctor?.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:underline">
            {user?.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600">{doctor?.specialty}</p>
        <p className="text-sm text-gray-500">{doctor?.doctor_office}</p>
        <RemoveBtn
          doctorId={doctor?.id as string}
          patientId={patientId as string}
        />
      </div>
    </div>
  );
};

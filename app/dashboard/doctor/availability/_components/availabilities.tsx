"use client";

import { useGetDoctorAvailability } from "@/queries/doctor-availability/use-get-availability";
import { Skeleton } from "@/components/ui/skeleton";
import AvailabilityCard from "./availability-card";
import { Calendar } from "lucide-react";

export const Availabilities = ({ id }: { id: string | undefined }) => {
  const { data, isLoading } = useGetDoctorAvailability(id);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 border rounded-xl mt-12">
        <Skeleton className="h-10 w-full mb-4" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!data) {
    return <div>Ocorreu um erro ao carregar as datas</div>;
  }

  return (
    <div className="container mx-auto py-8 border rounded-xl mt-12">
      {data?.availability.length === 0 ? (
        <div className="mt-8 bg-white shadow-sm rounded-xl overflow-hidden p-6 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">
            Nada por aqui ainda...
          </h3>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Minhas datas disponíveis</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-10">
            {data.availability.map((slot) => (
              <AvailabilityCard
                key={slot.id}
                id={slot.id}
                doctorId={slot.doctorId}
                availableDate={slot.availableDate}
                endTime={slot.endTime}
                startTime={slot.startTime}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

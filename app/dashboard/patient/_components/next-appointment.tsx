"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetPatientNextAppointment } from "@/queries/patients/use-get-next-appointment";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import placeholder from "@/public/placeholder-logo.jpg";

export const NextAppointment = ({ id }: { id: string | undefined }) => {
  const { data, isLoading } = useGetPatientNextAppointment(id);

  if (isLoading) {
    return (
      <div className="col-span-1 lg:col-span-2">
        <Skeleton className="w-full h-60" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="col-span-1 lg:col-span-2 bg-white p-4 md:p-6 rounded-lg shadow">
        <h2 className="text-lg md:text-xl font-bold mb-4">Próxima consulta</h2>
        <p className="text-gray-500">Nenhuma consulta agendada</p>
      </div>
    );
  }

  return (
    <div className="col-span-1 lg:col-span-2 bg-white p-4 md:p-6 rounded-lg shadow">
      <h2 className="text-lg md:text-xl font-bold mb-4">Próxima consulta</h2>
      <div className="flex items-center">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <Image
            src={data?.user?.image || placeholder}
            alt="doctor"
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="ml-4">
          <p className="text-gray-700 font-semibold">Dr. {data?.user?.name}</p>
          <p className="text-gray-500 text-sm md:text-base">
            {data?.appointment?.availableDate
              ? format(parseISO(data.appointment.availableDate), "dd/MM/yyyy", {
                  locale: ptBR,
                })
              : "Data não disponível"}{" "}
            <span>
              | {data?.appointment.startTime?.slice(0, 5)} -{" "}
              {data?.appointment.endTime?.slice(0, 5)}
            </span>
          </p>
          <p className="text-gray-500 text-sm md:text-base">
            {data?.appointment.doctorOffice}
          </p>
        </div>
      </div>
      <Link href={`/dashboard/patient/appointments/${data?.appointment.id}`}>
        <button className="mt-4 bg-blue-500 text-white px-3 md:px-4 py-2 rounded">
          Ver Detalhes
        </button>
      </Link>
    </div>
  );
};

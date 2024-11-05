"use client";

import { parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { format } from "date-fns";
import {
  User,
  ClipboardList,
  Calendar,
  Clock,
  MapPin,
  Building,
} from "lucide-react";
import { useGetDoctorAppointment } from "@/queries/appointments/use-get-doctor-appointment";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useConfirmAppointment } from "@/queries/appointments/use-confirm-appointment";
import { useCancelAppointment } from "@/queries/appointments/use-cancel-appointment";
import { useCompleteAppointment } from "@/queries/appointments/use-complete-appointment";
import { useRouter } from "next/navigation";
import { useDeleteAppointment } from "@/queries/appointments/use-delete-appointment";

export const Appointment = ({
  id,
  doctorId,
}: {
  id: string;
  doctorId: string | undefined;
}) => {
  const { data, isLoading } = useGetDoctorAppointment(id);
  const router = useRouter();
  const confirmAppointment = useConfirmAppointment(id, doctorId);
  const cancelAppointment = useCancelAppointment(id, doctorId);
  const completeAppointment = useCompleteAppointment(id, doctorId);
  const deleteAppointment = useDeleteAppointment(id, doctorId);

  const translateStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return "PENDENTE";
      case "SCHEDULED":
        return "CONFIRMADO";
      case "CANCELLED":
        return "CANCELADO";
      case "COMPLETED":
        return "COMPLETADO";
      default:
        return status;
    }
  };

  const handleConfirm = (id: string | undefined) => {
    confirmAppointment.mutate(
      { param: { id } },
      {
        onSuccess: () => {
          router.push("/dashboard/doctor/appointments");
        },
      }
    );
  };

  const handleCancel = (id: string | undefined) => {
    cancelAppointment.mutate(
      { param: { id } },
      {
        onSuccess: () => {
          router.push("/dashboard/doctor/appointments");
        },
      }
    );
  };

  const handleComplete = (id: string | undefined) => {
    completeAppointment.mutate(
      { param: { id } },
      {
        onSuccess: () => {
          router.push("/dashboard/doctor/appointments");
        },
      }
    );
  };

  const handleDelete = () => {
    deleteAppointment.mutate();
    router.push("/dashboard/doctor/appointments");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white rounded-md shadow-lg">
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-3xl font-bold text-white">
            <Skeleton className="h-8 w-48" />
          </h1>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col mb-4 gap-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-40" />

              <div className="flex flex-col gap-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-40" />
              </div>
            </div>

            <div className="flex flex-col gap-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-40" />

              <div className="flex flex-col gap-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-40" />
              </div>
            </div>

            <div className="flex flex-col gap-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>

          <div className="flex flex-col gap-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div>Appointment not found</div>;
  }

  return (
    <div className="min-h-screen bg-white rounded-md shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4">
        <h1 className="text-3xl font-bold text-white">Detalhes da consulta</h1>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex items-center mb-4">
              <User className="text-blue-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-600">Paciente</p>
                <Link href={`/dashboard/doctor/patient/${data?.patient?.id}`}>
                  <p className="text-lg font-semibold">{data?.user?.name}</p>
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <ClipboardList className="text-blue-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold">
                  {translateStatus(data.appointment.status)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex items-center mb-4">
              <Calendar className="text-blue-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-600">Data</p>
                <p className="text-lg font-semibold">
                  {data.appointment.availableDate
                    ? format(
                        parseISO(data.appointment.availableDate),
                        "dd/MM/yyyy",
                        {
                          locale: ptBR,
                        }
                      )
                    : "Nenhuma data disponível"}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="text-blue-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-600">Horário</p>
                <p className="text-lg font-semibold">
                  {data.appointment.startTime?.slice(0, 5)} -{" "}
                  {data.appointment.endTime?.slice(0, 5)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex items-start">
              <MapPin className="text-blue-600 mr-3 mt-1" size={24} />
              <div>
                <p className="text-sm text-gray-600">Localização</p>
                <p className="text-lg font-semibold">
                  {data.appointment.doctorOffice}
                </p>
                <p className="text-md">
                  {data.appointment.city}, {data.appointment.state}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white shadow-md rounded-lg p-4">
          <div className="flex items-start">
            <Building className="text-blue-600 mr-3 mt-1 shrink-0" size={24} />
            <div>
              <p className="text-sm text-gray-600">Sintomas/Condição médica</p>
              <p className="text-lg font-semibold">
                {data.appointment.medicalCondition}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          {data.appointment.status === "PENDING" && (
            <Button
              onClick={() => handleConfirm(id)}
              disabled={confirmAppointment.isPending}>
              Confirmar Consulta
            </Button>
          )}
          {data.appointment.status === "SCHEDULED" && (
            <Button
              onClick={() => handleComplete(id)}
              disabled={completeAppointment.isPending}>
              Marcar como completado
            </Button>
          )}
          {data.appointment.status === "SCHEDULED" && (
            <Button
              onClick={() => handleCancel(id)}
              variant="destructive"
              disabled={cancelAppointment.isPending}>
              Cancelar Consulta
            </Button>
          )}
          <Button variant="destructive" onClick={() => handleDelete()}>
            Deletar Consulta
          </Button>
        </div>
      </div>
    </div>
  );
};

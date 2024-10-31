"use client";

import Image from "next/image";
import { useGetPatientAppointment } from "@/queries/appointments/use-get-patient-appointment";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, Calendar, Clock, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCancelAppointmentByPatient } from "@/queries/appointments/use-cancel-appointment-by-patient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppointmentSkeleton } from "@/components/skeletons/appointment-skeleton";

export const Appointment = ({
  id,
  patientId,
}: {
  id: string;
  patientId: string | undefined;
}) => {
  const { data, isLoading } = useGetPatientAppointment(id);
  const cancelAppointment = useCancelAppointmentByPatient(id, patientId);
  const router = useRouter();

  const handleCancel = (id: string | undefined) => {
    cancelAppointment.mutate(
      { param: { id } },
      {
        onSuccess: () => {
          router.push("/dashboard/patient/appointments");
        },
      }
    );
  };
  if (isLoading) {
    return <AppointmentSkeleton />;
  }

  if (!data) {
    return <div>Appointment not found</div>;
  }

  const getStatusColor = (status: string | null) => {
    if (!status) {
      return "bg-gray-100 text-gray-800";
    }
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const translateStatus = (status: string) => {
    if (!status) {
      return "Pendente";
    }
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

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Detalhes da Consulta
          </h2>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              getStatusColor(data?.appointment?.status)
            )}>
            {translateStatus(data?.appointment?.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg space-y-4">
              <div className="flex items-center space-x-3 text-gray-700">
                <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>
                  {data?.appointment?.availableDate
                    ? format(
                        new Date(data.appointment.availableDate),
                        "dd 'de' MMMM 'de' yyyy",
                        { locale: ptBR }
                      )
                    : "Data não definida"}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>
                  {`${
                    data?.appointment?.startTime?.slice(0, 5) ||
                    "Início não definido"
                  } - ${
                    data?.appointment?.endTime?.slice(0, 5) ||
                    "Término não definido"
                  }`}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p>{data?.user?.address}</p>
                  <p>{data?.user?.address2}</p>
                  <p>
                    {data?.user?.city}, {data?.user?.state}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Informações do Médico
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={data?.user?.image || "/api/placeholder/64/64"}
                    alt="doctor"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <Link href={`/dashboard/patient/doctors/${data?.doctor?.id}`}>
                    <p className="font-semibold text-gray-900 hover:underline">
                      {data?.user?.name}
                    </p>
                  </Link>
                  <p className="text-sm text-gray-500">
                    {data?.doctor?.specialty}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span>{data?.user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-gray-500 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
            Cancelamento disponível até 24h antes da consulta
          </div>
          <Button
            variant="destructive"
            onClick={() => handleCancel(data?.appointment?.id)}
            disabled={cancelAppointment.isPending}>
            {cancelAppointment.isPending
              ? "Cancelando..."
              : "Cancelar Consulta"}
          </Button>
        </div>
      </div>
    </div>
  );
};

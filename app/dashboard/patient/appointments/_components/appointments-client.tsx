"use client";

import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { useGetPatientAppointments } from "@/queries/appointments/use-get-patient-appointments";
import { AppointmentsDataTable } from "./appointments-table";
import { columns } from "./columns";

export const AppointmentsClient = ({
  patientId,
}: {
  patientId: string | undefined;
}) => {
  const { data, isLoading } = useGetPatientAppointments(patientId);

  if (isLoading) {
    return <TableSkeleton />;
  }

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

  const formattedData =
    data?.map((appointment) => ({
      id: appointment.appointment.id,
      doctorId: appointment.doctor?.id,
      doctorOffice: appointment.appointment.doctorOffice,
      status: translateStatus(appointment.appointment.status),
      address: appointment.appointment.address || "N/A",
      address2: appointment.appointment.address2 || "N/A",
      city: appointment.appointment.city || "N/A",
      state: appointment.appointment.state || "N/A",
      doctorName: appointment.user?.name || "N/A",
      doctorEmail: appointment.user?.email || "N/A",
      appointmentDate: appointment.appointment.availableDate,
      startTime: appointment.appointment.startTime,
      endTime: appointment.appointment.endTime,
    })) || [];

  return (
    <AppointmentsDataTable
      data={formattedData}
      columns={columns}
      searchKey="doctorName"
    />
  );
};

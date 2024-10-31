"use client";

import { useGetDoctorAppointments } from "@/queries/appointments/use-get-doctor-appointments";
import { AppointmentsDataTable } from "./appointments-table";
import { columns } from "./columns";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { useDeleteAppointments } from "@/queries/appointments/use-delete-appointments";

export const AppointmentsClient = ({
  doctorId,
}: {
  doctorId: string | undefined;
}) => {
  const { data, isLoading } = useGetDoctorAppointments(doctorId);
  const deleteAppointments = useDeleteAppointments(doctorId);

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
      patientId: appointment.patient?.id,
      doctorOffice: appointment.appointment.doctorOffice,
      status: translateStatus(appointment.appointment.status),
      address: appointment.appointment.address || "N/A",
      address2: appointment.appointment.address2 || "N/A",
      city: appointment.appointment.city || "N/A",
      state: appointment.appointment.state || "N/A",
      patientName: appointment.user?.name || "N/A",
      patientEmail: appointment.user?.email || "N/A",
      appointmentDate: appointment.appointment.availableDate,
      startTime: appointment.appointment.startTime,
      endTime: appointment.appointment.endTime,
    })) || [];

  return (
    <AppointmentsDataTable
      columns={columns}
      data={formattedData}
      onDelete={(row) => {
        const ids = row.map((r) => r.original.id);
        deleteAppointments.mutate({ ids });
      }}
      searchKey="patientName"
    />
  );
};

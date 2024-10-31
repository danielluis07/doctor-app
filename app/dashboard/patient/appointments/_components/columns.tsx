"use client";

import { ColumnDef } from "@tanstack/react-table";
import { parseISO, format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppointmentsCellAction } from "./appointments-cell-action";

export type Appointment = {
  id: string;
  doctorOffice: string | null;
  status: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  doctorName: string | null;
  doctorEmail: string | null;
  appointmentDate: string | null;
  startTime: string | null;
  endTime: string | null;
};

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "doctorName",
    header: "Paciente",
  },
  {
    accessorKey: "appointmentDate",
    header: "Data",
    cell: ({ row }) => {
      const availableDate = row.original.appointmentDate;
      if (!availableDate) {
        return <span>Sem data</span>;
      }

      const date = parseISO(availableDate);

      if (isToday(date)) {
        return <span>Hoje</span>;
      }

      if (isTomorrow(date)) {
        return <span>Amanhã</span>;
      }

      return <span>{format(date, "dd/MM/yyyy", { locale: ptBR })}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => <AppointmentsCellAction id={row.original.id} />,
  },
];

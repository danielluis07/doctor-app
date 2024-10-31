"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { parseISO, format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppointmentsCellAction } from "./appointments-cell-action";
import { Checkbox } from "@/components/ui/checkbox";

export type ResponseType = InferResponseType<
  (typeof client.api.appointments.doctor)[":doctorId"]["$get"],
  200
>["data"][0];

export type Appointment = {
  id: string;
  doctorOffice: string | null;
  status: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  patientName: string | null;
  patientEmail: string | null;
  appointmentDate: string | null;
  startTime: string | null;
  endTime: string | null;
};

export const columns: ColumnDef<Appointment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "patientName",
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

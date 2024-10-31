import React from "react";
import { Calendar, Clock, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDeleteAvailability } from "@/queries/doctor-availability/use-delete.availability";

type AvailabilityCardProps = {
  id: string;
  doctorId: string | null;
  availableDate: string | null;
  startTime: string | null;
  endTime: string | null;
};

export const AvailabilityCard = ({
  id,
  doctorId,
  availableDate,
  endTime,
  startTime,
}: AvailabilityCardProps) => {
  const deleteAvailabilityMutation = useDeleteAvailability(doctorId, id);

  if (!availableDate || !endTime || !startTime) {
    return null;
  }

  const onDelete = () => {
    deleteAvailabilityMutation.mutate();
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center text-gray-700">
          <Calendar className="w-5 h-5 mr-3 text-blue-500" />
          <p className="font-medium">
            {format(parseISO(availableDate), "dd 'de' MMMM, yyyy", {
              locale: ptBR,
            })}
          </p>
        </div>
        <div className="flex items-center text-gray-700">
          <Clock className="w-5 h-5 mr-3 text-blue-500" />
          <p className="font-medium">
            {startTime.slice(0, 5)} - {endTime.slice(0, 5)}
          </p>
        </div>
      </div>
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
        aria-label="Remover disponibilidade">
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default AvailabilityCard;

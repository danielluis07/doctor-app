"use client";

import { useGetDoctorAvailability } from "@/queries/doctor-availability/use-get-availability";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Calendar, ChevronUp, ChevronDown, Clock } from "lucide-react";

export const DoctorAvailability = ({
  doctorId,
}: {
  doctorId: string | undefined;
}) => {
  const { data, isLoading } = useGetDoctorAvailability(doctorId);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (isLoading) {
    return <Skeleton className="w-full h-10" />;
  }

  return (
    <div className="mt-8 bg-white shadow-lg rounded-2xl overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger className="w-full p-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Horários disponíveis</h3>
            </div>
            {isOpen ? (
              <ChevronUp className="w-6 h-6" />
            ) : (
              <ChevronDown className="w-6 h-6" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-6">
            {data && data?.availability?.length > 0 ? (
              <ul className="space-y-4">
                {data.availability.map((slot) => (
                  <li
                    key={slot.id}
                    className="flex items-center gap-x-4 bg-sky-50 border border-sky-100 rounded-xl p-4 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center space-x-3 flex-grow">
                      <Calendar className="w-5 h-5 text-sky-500" />
                      <span className="font-semibold text-gray-700">
                        {slot.availableDate
                          ? format(
                              parseISO(slot.availableDate),
                              "dd 'de' MMMM, yyyy",
                              {
                                locale: ptBR,
                              }
                            )
                          : "Data não disponível"}
                      </span>
                    </div>
                    {slot.startTime && slot.endTime && (
                      <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm">
                        <Clock className="w-4 h-4 text-sky-500" />
                        <span className="text-sm font-medium text-gray-600">
                          {slot.startTime.slice(0, 5)} -{" "}
                          {slot.endTime.slice(0, 5)}
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-4">
                Nenhuma data disponível
              </p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

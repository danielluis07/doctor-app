import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetPatientAppointments = (patientId: string | undefined) => {
  const query = useQuery({
    enabled: !!patientId,
    queryKey: ["appointments", { patientId }],
    queryFn: async () => {
      const res = await client.api.appointments.patient[":patientId"].$get({
        param: { patientId },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetDoctorAppointments = (doctorId: string | undefined) => {
  const query = useQuery({
    enabled: !!doctorId,
    queryKey: ["appointments", { doctorId }],
    queryFn: async () => {
      const res = await client.api.appointments.doctor[":doctorId"].$get({
        param: { doctorId },
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

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetDoctorAppointment = (id: string | undefined) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["appointment", { id }],
    queryFn: async () => {
      const res = await client.api.appointments.doctor.appointment[":id"].$get({
        param: { id },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch appointment");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};

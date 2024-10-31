import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetDoctorAvailability = (doctorId: string | undefined) => {
  const query = useQuery({
    enabled: !!doctorId,
    queryKey: ["availability", { doctorId }],
    queryFn: async () => {
      const res = await client.api.availability[":doctorId"].$get({
        param: { doctorId },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch doctor availability");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};

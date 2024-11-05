import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetDoctorNextAppointment = (id: string | undefined) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["patient-next-appointment", { id }],
    queryFn: async () => {
      const res = await client.api.patients["next-appointment"][":id"].$get({
        param: { id },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch next appointment");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};

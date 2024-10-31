import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetDoctorProfile = (id: string | undefined) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["doctor-profile", { id }],
    queryFn: async () => {
      const res = await client.api.doctors[":id"].$get({
        param: { id },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch doctor");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};

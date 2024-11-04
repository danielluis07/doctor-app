import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetFavorites = (patientId: string | undefined) => {
  const query = useQuery({
    enabled: !!patientId,
    queryKey: ["favorites", { patientId }],
    queryFn: async () => {
      const res = await client.api.favorites.patient[":id"].$get({
        param: { id: patientId },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch favorite doctors");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};

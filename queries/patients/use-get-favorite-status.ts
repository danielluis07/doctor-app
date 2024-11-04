import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetFavoriteStatus = (patientId: string, doctorId: string) => {
  const query = useQuery({
    enabled: !!patientId,
    queryKey: ["favorites-status", { patientId, doctorId }],
    queryFn: async () => {
      const res = await client.api.favorites.patient[":id"].$get({
        param: { id: patientId },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch favorite doctors");
      }

      const { data } = await res.json();

      return data.some(
        (favorite: any) => favorite.favorites.doctorId === doctorId
      );
    },
  });
  return query;
};

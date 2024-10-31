import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetReviews = (doctorId: string) => {
  const query = useQuery({
    enabled: !!doctorId,
    queryKey: ["reviews", { doctorId }],
    queryFn: async () => {
      const res = await client.api.reviews.doctor[":doctorId"].$get({
        param: { doctorId },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};

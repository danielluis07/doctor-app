import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetUser = (id: string | undefined) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["user", { id }],
    queryFn: async () => {
      const res = await client.api.users[":id"].$get({
        param: { id },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.availability)[":id"]["$delete"]
>;

export const useDeleteAvailability = (doctorId: string | null, id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const res = await client.api.availability[":id"]["$delete"]({
        param: { id },
      });
      return await res.json();
    },
    onMutate: async () => {
      const previousAvailability = queryClient.getQueryData([
        "availability",
        { doctorId },
      ]);

      queryClient.setQueryData(["availability", { doctorId }], (old: any) => {
        if (!old) {
          return old;
        }

        return {
          ...old,
          availability: old.availability.filter((slot: any) => slot.id !== id),
        };
      });

      return { previousAvailability };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["availability", { doctorId }],
      });
    },
    onSuccess: () => {
      toast.success("Data deletada!");
    },
    onError: () => {
      toast.error("Houve um erro ao deletar a data!");
    },
  });

  return mutation;
};

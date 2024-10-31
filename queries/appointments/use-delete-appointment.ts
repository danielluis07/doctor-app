import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.appointments)[":id"]["$delete"]
>;

export const useDeleteAppointment = (
  id: string | undefined,
  doctorId: string | undefined
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const res = await client.api.appointments[":id"]["$delete"]({
        param: { id },
      });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Consulta deletada!");
      queryClient.invalidateQueries({
        queryKey: ["appointments", { doctorId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["appointment", { id }],
      });
    },
    onError: () => {
      toast.error("Houve um erro! Tente novamente!");
    },
  });

  return mutation;
};

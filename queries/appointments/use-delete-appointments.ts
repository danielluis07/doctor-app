import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.appointments)["delete-appointments"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.appointments)["delete-appointments"]["$post"]
>["json"];

export const useDeleteAppointments = (doctorId: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.appointments["delete-appointments"]["$post"](
        {
          json,
        }
      );
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Consultas deletadas!");
      queryClient.invalidateQueries({
        queryKey: ["appointments", { doctorId }],
      });
    },
    onError: () => {
      toast.error("Houve um erro ao deletar as consultas!");
    },
  });

  return mutation;
};

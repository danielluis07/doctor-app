import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.users)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.users)[":id"]["$patch"]
>["json"];

export const useUpdateUser = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.users[":id"]["$patch"]({
        param: { id },
        json,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Usuário editado!");
      queryClient.invalidateQueries({ queryKey: ["user", { id }] });
    },
    onError: () => {
      toast.error("Houve um erro ao editar!");
    },
  });

  return mutation;
};

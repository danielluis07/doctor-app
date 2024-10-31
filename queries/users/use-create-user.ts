import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.users.$post>;
type RequestType = InferRequestType<typeof client.api.users.$post>["json"];

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.users.$post({ json });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Usuário criado!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Houve um erro ao criar o usuario!");
    },
  });

  return mutation;
};

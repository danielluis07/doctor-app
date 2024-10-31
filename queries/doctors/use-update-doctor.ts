import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.users.doctor)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.users.doctor)[":id"]["$patch"]
>["json"];

export const useUpdateDoctor = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.users.doctor[":id"]["$patch"]({
        param: { id },
        json,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Perfil editado!");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctor", { id }] });
    },
    onError: () => {
      toast.error("Houve um erro ao editar o perfil!");
    },
  });

  return mutation;
};

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.availability)["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.availability)["$post"]
>["json"];

export const useCreateDoctorAvailability = (doctorId: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.availability["$post"]({
        json,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Disponobilidade criada!");
      queryClient.invalidateQueries({
        queryKey: ["availability", { doctorId }],
      });
    },
    onError: () => {
      toast.error("Houve um erro! Tente novamente!");
    },
  });

  return mutation;
};

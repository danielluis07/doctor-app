import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.reviews)["$post"]>;
type RequestType = InferRequestType<
  (typeof client.api.reviews)["$post"]
>["json"];

export const useCreateDoctorReview = (doctorId: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.reviews["$post"]({
        json,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Review criada!");
      queryClient.invalidateQueries({ queryKey: ["reviews", { doctorId }] });
    },
    onError: () => {
      toast.error("Houve um erro! Tente novamente!");
    },
  });

  return mutation;
};

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.favorites)["$post"]>;
type RequestType = InferRequestType<
  (typeof client.api.favorites)["$post"]
>["json"];

type MutationContext = {
  previousFavoriteStatus: boolean | undefined;
};

export const useCreateFavorite = (doctorId: string, patientId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType,
    MutationContext
  >({
    mutationFn: async (json) => {
      const res = await client.api.favorites["$post"]({
        json,
      });
      return await res.json();
    },
    onMutate: async () => {
      const previousFavoriteStatus = queryClient.getQueryData<
        boolean | undefined
      >(["favorites-status", { doctorId, patientId }]);
      queryClient.setQueryData(
        ["favorites-status", { doctorId, patientId }],
        (old: any) => {
          if (!old) return true;
          return true;
        }
      );

      return { previousFavoriteStatus };
    },
    onSuccess: () => {
      toast.success("Médico Favoritado!");
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["favorites-status", { doctorId, patientId }],
        context?.previousFavoriteStatus
      );
      toast.error("Houve um erro! Tente novamente!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites-status", { doctorId, patientId }],
      });
    },
  });

  return mutation;
};

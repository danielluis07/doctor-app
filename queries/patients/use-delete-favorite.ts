import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.favorites)["$delete"]>;
type RequestType = InferRequestType<
  (typeof client.api.favorites)["$post"]
>["json"];

type MutationContext = {
  previousFavoriteStatus: boolean | undefined;
  previousFavoritesList:
    | Array<{ doctorId: string; [key: string]: any }>
    | undefined;
};

export const useDeleteFavorite = (doctorId: string, patientId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType,
    MutationContext
  >({
    mutationFn: async () => {
      const res = await client.api.favorites["$delete"]({
        json: { patientId, doctorId },
      });
      return await res.json();
    },
    onMutate: async () => {
      // Store previous favorite status and list
      const previousFavoriteStatus = queryClient.getQueryData<
        boolean | undefined
      >(["favorites-status", { doctorId, patientId }]);

      const previousFavoritesList = queryClient.getQueryData<
        Array<{ doctorId: string; [key: string]: any }>
      >(["favorites", { patientId }]);

      // Update the favorite status
      queryClient.setQueryData(
        ["favorites-status", { doctorId, patientId }],
        () => false
      );

      // Optimistically remove doctor from the favorites list
      queryClient.setQueryData(
        ["favorites", { patientId }],
        (old: Array<{ doctorId: string; [key: string]: any }> | undefined) => {
          return old ? old.filter((fav) => fav.doctorId !== doctorId) : [];
        }
      );

      return { previousFavoriteStatus, previousFavoritesList };
    },
    onSuccess: () => {
      toast.success("Removido!");
    },
    onError: (err, variables, context) => {
      // Rollback to previous favorite status and list if there's an error
      queryClient.setQueryData(
        ["favorites-status", { doctorId, patientId }],
        context?.previousFavoriteStatus
      );
      queryClient.setQueryData(
        ["favorites", { patientId }],
        context?.previousFavoritesList
      );
      toast.error("Houve um erro! Tente novamente!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites-status", { doctorId, patientId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["favorites", { patientId }],
      });
    },
  });

  return mutation;
};

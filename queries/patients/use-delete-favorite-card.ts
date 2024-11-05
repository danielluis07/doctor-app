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
};

export const useDeleteFavoriteCard = (doctorId: string, patientId: string) => {
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
      const previousFavoriteStatus = queryClient.getQueryData<
        boolean | undefined
      >(["favorites-status", { doctorId, patientId }]);

      // Optimistically update UI immediately
      queryClient.setQueryData(
        ["favorites-status", { doctorId, patientId }],
        false
      );

      // Directly update "favorites" list query
      queryClient.setQueryData(["favorites", { patientId }], (old: any) => {
        return old?.filter((doc: any) => doc.doctorId !== doctorId) || [];
      });

      return { previousFavoriteStatus };
    },
    onSuccess: () => {
      toast.success("Removido!");
    },
    onError: (err, variables, context) => {
      // Rollback on error
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
      queryClient.invalidateQueries({
        queryKey: ["favorites", { patientId }],
      });
    },
  });

  return mutation;
};

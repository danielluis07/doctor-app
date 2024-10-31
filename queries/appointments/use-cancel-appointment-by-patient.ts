import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.appointments.cancel)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.appointments.cancel)[":id"]["$patch"]
>;

export const useCancelAppointmentByPatient = (
  id: string | undefined,
  patientId: string | undefined
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      const res = await client.api.appointments.cancel[":id"]["$patch"]({
        param: { id },
      });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Consulta cancelada!");
      queryClient.invalidateQueries({
        queryKey: ["appointments", { patientId }],
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

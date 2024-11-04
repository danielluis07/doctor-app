"use client";

import { Button } from "@/components/ui/button";
import { useDeleteFavorite } from "@/queries/patients/use-delete-favorite";

export const RemoveBtn = ({
  doctorId,
  patientId,
}: {
  doctorId: string | undefined;
  patientId: string | undefined;
}) => {
  if (!doctorId || !patientId) {
    return null;
  }

  const deleteFavoriteMutation = useDeleteFavorite(doctorId, patientId);
  const removeFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    deleteFavoriteMutation.mutate({ doctorId, patientId });
  };

  return (
    <Button
      onClick={removeFavorite}
      className="mt-3 px-3 py-1 bg-transparent text-rose-500 border border-rose-500 rounded-md hover:bg-rose-500 hover:text-white transition-colors">
      Remover dos Favoritos
    </Button>
  );
};

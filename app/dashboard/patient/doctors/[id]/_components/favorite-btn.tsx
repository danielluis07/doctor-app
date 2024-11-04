"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateFavorite } from "@/queries/patients/use-create-favorite";
import { useGetFavoriteStatus } from "@/queries/patients/use-get-favorite-status";
import { useDeleteFavorite } from "@/queries/patients/use-delete-favorite";
import { Skeleton } from "@/components/ui/skeleton";

export const FavoriteBtn = ({
  doctorId,
  patientId,
}: {
  doctorId: string;
  patientId: string;
}) => {
  const { data: isFavorited, isLoading } = useGetFavoriteStatus(
    patientId,
    doctorId
  );
  const createFavoriteMutation = useCreateFavorite(doctorId, patientId);
  const deleteFavoriteMutation = useDeleteFavorite(doctorId, patientId);
  const handleFavorite = () => {
    if (isFavorited) {
      deleteFavoriteMutation.mutate({ doctorId, patientId });
    } else {
      createFavoriteMutation.mutate({ doctorId, patientId });
    }
  };

  if (isLoading) {
    return <Skeleton className="w-full h-10" />;
  }

  return (
    <Button
      onClick={handleFavorite}
      className={cn(
        "flex items-center px-3 py-2 w-full",
        isFavorited
          ? "bg-rose-500 text-white border border-rose-500 hover:bg-transparent hover:text-rose-500"
          : "bg-transparent text-rose-500 border border-rose-500 hover:bg-rose-500 hover:text-white"
      )}>
      <Heart /> {isFavorited ? "Favorito" : "Favoritar"}
    </Button>
  );
};

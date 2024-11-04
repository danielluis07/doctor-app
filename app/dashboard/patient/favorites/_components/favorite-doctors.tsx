"use client";

import Image from "next/image";
import placeholder from "@/public/placeholder-logo.jpg";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFavorites } from "@/queries/patients/use-get-favorites";
import Link from "next/link";
import { DoctorCardSkeleton } from "@/components/skeletons/favorite-cards-skeleton";
import { FavoriteCard } from "./favorite-card";
import { Frown } from "lucide-react";

export const FavoriteDoctors = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetFavorites(id);

  if (isLoading) {
    return <DoctorCardSkeleton />;
  }

  if (!data) {
    return <div>Não foi possível carregar as informações</div>;
  }

  if (data.length === 0) {
    return (
      <div className="mt-8 bg-white shadow-sm rounded-xl overflow-hidden p-6 text-center">
        <Frown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-500">
          Nenhum médico favoritado ainda...
        </h3>
        <p className="text-gray-500 mt-2">
          Os médicos que você marcou como favorito aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => (
        <FavoriteCard
          doctor={item.doctor}
          user={item.user}
          patientId={id}
          key={item.favorites.id}
        />
      ))}
    </div>
  );
};

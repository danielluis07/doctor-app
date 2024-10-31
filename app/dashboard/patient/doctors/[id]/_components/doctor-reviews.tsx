"use client";

import Image from "next/image";
import placeholder from "@/public/placeholder-logo.jpg";
import { useGetReviews } from "@/queries/reviews/use-get-review";
import { Rating } from "react-simple-star-rating";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import { format } from "date-fns";

export const DoctorReviews = ({ doctorId }: { doctorId: string }) => {
  const { data: reviews, isLoading } = useGetReviews(doctorId);

  if (isLoading) {
    return (
      <div className="mt-8 space-y-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-24 h-3" />
              </div>
            </div>
            <Skeleton className="w-full h-16 mt-4" />
          </div>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-8 bg-white shadow-sm rounded-xl overflow-hidden p-6 text-center">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800">
          Nenhum comentário ainda...
        </h3>
        <p className="text-gray-500 mt-2">
          Os comentários sobre esse médico aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex">
        <MessageSquare className="mr-2 mt-2 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          Comentários
        </h2>
      </div>
      <div className="space-y-6">
        {reviews.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-100">
                  <Image
                    src={item.user?.image || placeholder}
                    alt={item.user?.name || "User"}
                    sizes="48px"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">
                    {item.user?.name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Rating
                      size={18}
                      readonly
                      allowFraction
                      initialValue={Number(item.review.rating)}
                    />
                    <span className="text-[12px] text-gray-500 mt-1.5">
                      {item.review.createdAt
                        ? format(
                            new Date(item.review.createdAt),
                            "dd/MM/yyyy 'às' HH:mm'h'"
                          )
                        : null}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 leading-relaxed">
                  {item.review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
